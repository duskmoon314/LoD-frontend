---
title: "Group Theory Application: Boolean Function Counting"
description: |
  Abstract algebra is often challenging to understand initially because of its abstract nature.
  This article introduces an application of group theory: counting boolean functions.
author: duskmoon
createdAt: 2023-04-23
updatedAt: 2023-05-31
tags:
  - Mathematics
  - Abstract Algebra
---

# Burnside's Lemma

When analyzing the action of a group on a set, Burnside's lemma is a very important theorem:

> **Burnside's Lemma**
>
> Let a finite group $G$ act on a finite set $X$, then the number of orbits of $X$ under the action of $G$ is
>
> $$
> N = \frac{1}{|G|} \sum_{g \in G} \chi(g)
> $$
>
> where $\chi(g)$ is the number of fixed points of $g$ on $X$.

There are many references for the proof of this lemma [^1][^2], which will not be repeated here.

# Boolean Function Counting Problem

## Problem Background

Boolean functions are an important class of functions that satisfy the mapping form $\mathbb{F}_2^n \to \mathbb{F}_2$. Usually, we use 0 and 1 to represent the two elements in $\mathbb{F}_2$, and the elements in $\mathbb{F}_2^n$ can be represented by a binary string of length $n$. Some common 2-element boolean functions and their truth tables are as follows:

1. Logical AND: $f(x, y) = x \land y$
   | x | y | f(x, y) |
   | - | - | ------- |
   | 0 | 0 | 0 |
   | 0 | 1 | 0 |
   | 1 | 0 | 0 |
   | 1 | 1 | 1 |
2. Logical OR: $f(x, y) = x \lor y$
   | x | y | f(x, y) |
   | - | - | ------- |
   | 0 | 0 | 0 |
   | 0 | 1 | 1 |
   | 1 | 0 | 1 |
   | 1 | 1 | 1 |
3. Logical XOR: $f(x, y) = x \oplus y$
   | x | y | f(x, y) |
   | - | - | ------- |
   | 0 | 0 | 0 |
   | 0 | 1 | 1 |
   | 1 | 0 | 1 |
   | 1 | 1 | 0 |

Boolean functions can also be represented by switch circuits, as shown in the following figure:

![The boolean function represented by switch circuits](/blog/group-theory/boolean-circuit.excalidraw.svg)

It can be seen that two switches in these three switch circuits can be exchanged. Some Boolean functions are equivalent under the permutation of the independent variables. Therefore, the counting problem of Boolean functions is raised: **For an $n$-variable Boolean function, how many essentially different Boolean functions are there?**

## Observing 2-variable Boolean Functions

Let's first take a look at the truth tables of all 2-variable Boolean functions:

| $f(x, y)$ | (0,0) | (0,1) | (1,0) | (1,1) |
| --------- | ----- | ----- | ----- | ----- |
| $f_{1}$   | 0     | 0     | 0     | 0     |
| $f_{2}$   | 0     | 0     | 0     | 1     |
| $f_{3}$   | 0     | 0     | 1     | 0     |
| $f_{4}$   | 0     | 0     | 1     | 1     |
| $f_{5}$   | 0     | 1     | 0     | 0     |
| $f_{6}$   | 0     | 1     | 0     | 1     |
| $f_{7}$   | 0     | 1     | 1     | 0     |
| $f_{8}$   | 0     | 1     | 1     | 1     |
| $f_{9}$   | 1     | 0     | 0     | 0     |
| $f_{10}$  | 1     | 0     | 0     | 1     |
| $f_{11}$  | 1     | 0     | 1     | 0     |
| $f_{12}$  | 1     | 0     | 1     | 1     |
| $f_{13}$  | 1     | 1     | 0     | 0     |
| $f_{14}$  | 1     | 1     | 0     | 1     |
| $f_{15}$  | 1     | 1     | 1     | 0     |
| $f_{16}$  | 1     | 1     | 1     | 1     |

Consider the permutation of two elements, that is, the permutation group $S_2 = \{ (1), (12) \}$. Boolean functions that satisfy $f_i (x, y) = f_j (y, x)$ are essentially the same. It can be seen that the pairs of Boolean functions that meet this condition in the above table are:

- $f_3$ and $f_5$
- $f_4$ and $f_6$
- $f_{11}$ and $f_{13}$
- $f_{12}$ and $f_{14}$

Therefore, the number of essentially different 2-variable Boolean functions is $16 - 4 = 12$.

So how to analyze it using Burnside's lemma? Count the elements in $S_2$ by permutation type, and list the number of fixed points on $F = \{ f_1, \cdots, f_{16} \}$ that it acts on:

| Permutation Type | Count | $\chi(g)$             |
| ---------------- | ----- | --------------------- |
| $1^2$            | 1     | $2^{2 \times 2} = 16$ |
| $2^1$            | 1     | $2^3 = 8$             |

For the $1^2$ type of permutation, the number of fixed points is the number of choices for each independent variable ($2 \times 2 = 4$ in total) multiplied by the number of choices for the result. Therefore, there are $2^4 = 16$ fixed points in total. For the $2^1$ type of permutation, the number of fixed points is the number of choices for the two independent variables that are bound together (00, 01, and 10, 11, for a total of $3$) multiplied by the number of choices for the result. Therefore, there are $2^3 = 8$ fixed points in total.

Therefore, by Burnside's lemma, the number of essentially different 2-variable Boolean functions is:

$$
N = \frac{1}{2} (1 \times 16 + 1 \times 8) = 12
$$

## 3-variable Boolean Functions

For 3-variable Boolean functions, we directly count the elements of S3 by permutation type:

| Permutation Type | Count | $\chi(g)$             |
| ---------------- | ----- | --------------------- |
| $1^3$            | 1     | $2^{2^3} = 256$       |
| $1^1 2^1$        | 3     | $2^{2 \times 3} = 64$ |
| $3^1$            | 2     | $2^4 = 16$            |

Compared with 2-variable Boolean functions, the permutation type $3^1$ appears in the table of 3-variable Boolean functions. Considering the combinations of 3 independent variables bound together and essentially different under cyclic shifts, there are 4: 000, 001, 011, 111. Therefore, there are $2^4 = 16$ fixed points.

Therefore, by Burnside's lemma, the number of essentially different 3-variable Boolean functions is:

$$
N = \frac{1}{3!} (1 \times 256 + 3 \times 64 + 2 \times 16) = 80
$$

## More General Cases

For n-variable Boolean functions, our task is to classify the elements of $S_n$ by permutation type and find the number of fixed points for each cycle. The number of fixed points is then split into the number of combinations corresponding to each cycle. For example, a $4^1$ permutation corresponds to 6 combinations: 0000, 0001, 0011, 0101, 0111, 1111. Therefore, a $4^1...$ permutation corresponds to $2^{6 \times \cdots}$ fixed points.

Note: Perhaps finding these combinations corresponds to a similar application problem, but I haven't thought of one yet.

[^1]: https://en.wikipedia.org/wiki/Burnside%27s_lemma
[^2]: 胡冠章 应用近世代数[M]. 第 3 版. 版. 北京: 清华大学出版社, 2006.