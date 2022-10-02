---
title: 在 Rust 过程宏中从 `Option` 提取类型
description: |
  最近在学习 Rust 过程宏，努力完成 proc-macro-workshop 的练习。在练习中遇到了一个问题，就是如何从 Option 中提取类型。这里记录一下解决方法。
author: 暮月
createdAt: 2022-10-01
layout: "@layouts/BlogPost.astro"
tags:
  - Rust
  - ProcMacro
---

在编写 Rust 过程宏的时候，一个很有可能遇到的情况是，我们需要从 `Option<T>` 中取出这个 `T`。但是 `Option` 的写法有很多，`syn` 解析基础的 `Option` 也会得到一个复杂的结构体，那么要如何正确的提取出 `T` 呢？

## `Option` 的五种写法

目前，据我所知，`Option` 有五种写法。(当然，可以先 `use std::option` 再写 `option::Option`，但真的会有人这么干吗？）

```rust
struct FiveOption {
  option_t: Option<String>,
  std_option_t: std::option::Option<String>,
  std_option_t_2: ::std::option::Option<String>,
  core_option_t: core::option::Option<String>,
  core_option_t_2: ::core::option::Option<String>,
}
```

这里偷一个懒，直接用了 `String` 作为 `T`，但是实际上，`T` 可以是任意类型。

那么，`syn` 解析得到的结构体会是什么样的呢？（部分无用的信息已省略）

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
                  // String 解析出来的内容
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
                  // String 解析出来的内容
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
                  // String 解析出来的内容
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
                  // String 解析出来的内容
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
                  // String 解析出来的内容
                ),],},),},],},},)
```

可以看出，他们都是 `PathSegment{ ident: Ident{ ident: "Option" }, arguments: AngleBracketed(...) }` 结尾的形式，我们是否可以逆向的匹配这一部分呢？如果仅匹配这一部分，对于形如 `Arc<Option<String>>` 的类型，我们会损失掉 `Arc` 的信息，这是不可取的。

因此，我们的思路是从头开始，找出 `Option` `std::option::Option` `core::option::Option` 三种模式，然后取出 `T`。

## 实现 `fn extract_type_from_option`

为了方便复用，我们把这个功能单独实现在一个函数 `extract_type_from_option` 中：

```rust
fn extract_type_from_option(ty: &syn::Type) -> Option<&syn::Type> {
    // 如果不是 TypePath，便不可能是 Option<T>，返回 None
    if let syn::Type::Path(syn::TypePath { qself: None, path }) = ty {
        // 我们已经限定了 Option 的 5 种写法，观察可知到 Option 后便不会再有同一等级的 PathSegment
        // 因此，我们只需取出最高等级的 PathSegment 并拼接为字符串，用于和分析结果进行比较
        let segments_str = &path
            .segments
            .iter()
            .map(|segment| segment.ident.to_string())
            .collect::<Vec<_>>()
            .join(":");
        // 将 PathSegment 拼接为字符串，比较后取出 Option 所在的 PathSegment
        let option_segment = ["Option", "std:option:Option", "core:option:Option"]
            .iter()
            .find(|s| segments_str == *s)
            .and_then(|_| path.segments.last());
        let inner_type = option_segment
            // 将 Option 所在 PathSegment 的泛型参数取出
            // 如果不是泛型，便不可能是 Option<T>，返回 None
            // 不过这种情况或许不应该出现
            .and_then(|path_seg| match &path_seg.arguments {
                syn::PathArguments::AngleBracketed(syn::AngleBracketedGenericArguments {
                    args,
                    ..
                }) => args.first(),
                _ => None,
            })
            // 将泛型参数中的类型信息取出
            // 如果不是类型，便不可能是 Option<T>，返回 None
            // 不过这种情况或许不应该出现
            .and_then(|generic_arg| match generic_arg {
                syn::GenericArgument::Type(ty) => Some(ty),
                _ => None,
            });
        // 返回 Option<T> 中的 T
        return inner_type;
    }
    None
}
```

# 参考

1. [How can I get the T from an Option<T> when using syn? David Bernard's answer](https://stackoverflow.com/a/56264023/15766817)
