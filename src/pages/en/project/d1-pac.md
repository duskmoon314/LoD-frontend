---
title: d1-pac
description: Peripheral access API for Allwinner D1 SoC generated from unofficial SVD file
layout: "@layouts/ProjectPost.astro"
github: https://github.com/duskmoon314/aw-pac
docs: https://docs.rs/d1-pac/latest/d1_pac/
crates: https://crates.io/crates/d1-pac
tags:
  - rust
  - embedded
---

# Brief Introduction

D1-H is an SoC based on T-HEAD's C906 IP (RV64IMAC) developed by Allwinner. D1s is a cut version of D1-H.

This project is based on Allwinner's open D1-H documentation, maintained a CMSIS-SVD file, and generated a Rust library via `svd2rust`.

Most of the peripherals are provided with registers' addresses and field descriptions. Some of them currently only have registers' addresses. Please refer to Allwinner's documentation and data manual for more details.

## Chip Block Diagram

[![d1-h-arch](/d1-h-arch.png)](https://d1.docs.aw-ol.com/en/)

## Peripheral Support List

- 💚: Register addresses and descriptions
- 💛: Register addresses only
- 💔: Not yet supported

TODO:

| Support | Peripheral | Notes |
| ------- | ---------- | ----- |
| 💚      | CCU        |       |
