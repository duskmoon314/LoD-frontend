---
title: d1-pac
description: 基于非官方SVD文件生成的全志D1 SoC的外设访问API库
layout: "@layouts/ProjectPost.astro"
github: https://github.com/duskmoon314/aw-pac
docs: https://docs.rs/d1-pac/latest/d1_pac/
crates: https://crates.io/crates/d1-pac
tags:
  - rust
  - embedded
---

# 简介

D1-H 是全志基于平头哥的 C906 IP（RV64IMAC）开发的 SoC。D1s 是 D1-H 剪裁了部分外设的版本。

本项目基于全志开放的 D1-H 文档，维护了一份非官方的 CMSIS-SVD 文件，以及通过`svd2rust`生成的 Rust 库。

大部分外设根据文档提供了寄存器的地址和字段描述，少部分目前只有地址。外设的使用细节请参见全志的文档和数据手册。

## 芯片框图

[![d1-h-arch](/d1-h-arch.png)](https://d1.docs.aw-ol.com/)

## 外设支持列表

- 💚：寄存器地址和描述
- 💛：仅寄存器地址
- 💔：尚未支持

TODO:

| 支持情况 | 外设 | 备注 |
| -------- | ---- | ---- |
| 💚       | CCU  |      |
