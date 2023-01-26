---
title: Extract type from `Option` in ProcMacro of Rust
description: |
  Recently I was learning Rust ProcMacro, and I was trying to complete the exercises of proc-macro-workshop. In the exercises, I encountered a problem, that is, how to extract the type from `Option`. Here I record the solution.
author: 暮月
createdAt: 2022-10-01
tags:
  - Rust
  - ProcMacro
---

In writing Rust ProcMacro, a situation that is very likely to be encountered is that we need to extract the `T` from `Option<T>`. But the writing of `Option` has many forms, and `syn` parses the basic `Option` to get a complex structure. How can we correctly extract `T`?

## Five ways to write `Option`

At present, as far as I know, there are five ways to write `Option`. (Of course, you can first `use std::option` and then write `option::Option`, but will anyone really do that?)

```rust
struct FiveOption {
  option_t: Option<String>,
  std_option_t: std::option::Option<String>,
  std_option_t_2: ::std::option::Option<String>,
  core_option_t: core::option::Option<String>,
  core_option_t_2: ::core::option::Option<String>,
}
```

Here I am lazy and use `String` as `T`, but in fact, `T` can be any type.

Then, what will the structure obtained by `syn` parsing be like? (Some useless information has been omitted)

```rust
option_t: Path(
  TypePath {
    qself: None,
    path: Path {
      segments: [
        PathSegment {
          ident: Ident {ident: "Option",},
          arguments: AngleBracketed(
            AngleBracketedGenericArguments {
              args: [
                Type(
                  // String's representation in syn
                ),],},),},],},},)
std_option_t: Path(
  TypePath {
    qself: None,
    path: Path {
      segments: [
        PathSegment {ident: Ident {ident: "std",},},
        Colon2,
        PathSegment {ident: Ident {ident: "option",},},
        Colon2,
        PathSegment {
          ident: Ident {ident: "Option",},
          arguments: AngleBracketed(
            AngleBracketedGenericArguments {
              args: [
                Type(
                  // String's representation in syn
                ),],},),},],},},)
std_option_t_2: Path(
  TypePath {
    qself: None,
    path: Path {
      leading_colon: Some(Colon2,),
      segments: [
        PathSegment {ident: Ident {ident: "std",},},
        Colon2,
        PathSegment {ident: Ident {ident: "option",},},
        Colon2,
        PathSegment {
          ident: Ident {ident: "Option",},
          arguments: AngleBracketed(
            AngleBracketedGenericArguments {
              args: [
                Type(
                  // String's representation in syn
                ),],},),},],},},)
core_option_t: Path(
  TypePath {
    qself: None,
    path: Path {
      segments: [
        PathSegment {ident: Ident {ident: "core",},},
        Colon2,
        PathSegment {ident: Ident {ident: "option",},},
        Colon2,
        PathSegment {
          ident: Ident {ident: "Option",},
          arguments: AngleBracketed(
            AngleBracketedGenericArguments {
              args: [
                Type(
                  // String's representation in syn
                ),],},),},],},},)
core_option_t_2: Path(
  TypePath {
    qself: None,
    path: Path {
      leading_colon: Some(Colon2,),
      segments: [
        PathSegment {ident: Ident {ident: "core",},},
        Colon2,
        PathSegment {ident: Ident {ident: "option",},},
        Colon2,
        PathSegment {
          ident: Ident {ident: "Option",},
          arguments: AngleBracketed(
            AngleBracketedGenericArguments {
              args: [
                Type(
                  // String's representation in syn
                ),],},),},],},},)
```

We can see that they are all in the form of `PathSegment{ ident: Ident{ ident: "Option" }, arguments: AngleBracketed(...) }` at the end. Can we match this part in reverse? If we only match this part, for types such as `Arc<Option<String>>`, we will lose the information of `Arc`, which is not acceptable.

So our idea is to start from the beginning, find the three patterns of `Option` `std::option::Option` `core::option::Option`, and then take out `T`.

## Implement `fn extract_type_from_option`

To facilitate reuse, we implement this function in a function `extract_type_from_option`:

```rust
fn extract_type_from_option(ty: &syn::Type) -> Option<&syn::Type> {
    // If it is not `TypePath`, it is not possible to be `Option<T>`, return `None`
    if let syn::Type::Path(syn::TypePath { qself: None, path }) = ty {
        // We have limited the 5 ways to write `Option`, and we can see that after `Option`,
        // there will be no `PathSegment` of the same level
        // Therefore, we only need to take out the highest level `PathSegment` and splice it into a string
        // for comparison with the analysis result
        let segments_str = &path
            .segments
            .iter()
            .map(|segment| segment.ident.to_string())
            .collect::<Vec<_>>()
            .join(":");
        // Concatenate `PathSegment` into a string, compare and take out the `PathSegment` where `Option` is located
        let option_segment = ["Option", "std:option:Option", "core:option:Option"]
            .iter()
            .find(|s| segments_str == *s)
            .and_then(|_| path.segments.last());
        let inner_type = option_segment
            // Take out the generic parameters of the `PathSegment` where `Option` is located
            // If it is not generic, it is not possible to be `Option<T>`, return `None`
            // But this situation may not occur
            .and_then(|path_seg| match &path_seg.arguments {
                syn::PathArguments::AngleBracketed(syn::AngleBracketedGenericArguments {
                    args,
                    ..
                }) => args.first(),
                _ => None,
            })
            // Take out the type information in the generic parameter
            // If it is not a type, it is not possible to be `Option<T>`, return `None`
            // But this situation may not occur
            .and_then(|generic_arg| match generic_arg {
                syn::GenericArgument::Type(ty) => Some(ty),
                _ => None,
            });
        // Return `T` in `Option<T>`
        return inner_type;
    }
    None
}
```

# Reference

1. [How can I get the T from an Option<T> when using syn? David Bernard's answer](https://stackoverflow.com/a/56264023/15766817)
