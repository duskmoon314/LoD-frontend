---
title: Hamming Code
description: |
  Relearned the classic Hamming code recently. Share the process and principles here.
author: Duskmoon
createdAt: 2022-08-25
layout: "@layouts/BlogPost.astro"
tags:
  - Encode
---

> Sorry for my poor English. Please feel free to point out my mistakes. Many thanks.

---

# Codeword and distance

Before introducing the Hamming code, let's take a brief look at the concept of codeword and distance. Consider the most classic ASCII encoding, where we represent a character with an 8-bit binary number, e.g. `01100100` for `d`, `01101101` for `m`, etc. Each group of 8 bits is called a **codeword** in this code space. At the same time, we can also define the distance between two codewords as the number of bits that differ between them. For example, the distance between `01100100` and `01101101` is 2. This distance is called **Hamming distance** or simply **code distance**.

![Codeword and code distance of d and m in ASCII code space](/blog/hamming-code/code-word-dist.excalidraw.png)

Obviously, the distance between any two codewords of displayable characters is at least 1. If any one bit in the transmission is flipped, it will result in a different codeword, which places a demand on the reliability of the communication. One needs a way to add redundant information to the codeword so that the distance between the codewords is at least 2, to detect errors in the transmission. Apparently, this is not a textbook for coding, so I will not go into the details of various coding schemes, but only briefly introduce the Hamming code.

# Hamming code

The Hamming code is a group error correction code proposed by Richard Wesley Hamming in 1950. The characteristic of the code is that any two codewords have a distance of at least 3. The idea is to add several redundant parity bits to the code to detect and correct 1-bit errors. The coding is as follows:

| Message | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  | 12  | 13  | 14  | 15  | 16  |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Source  | P1  | P2  | D1  | P4  | D2  | D3  | D4  | P8  | D5  | D6  | D7  | D8  | D9  | D10 | D11 | P16 |
| P1      | x   |     | x   |     | x   |     | x   |     | x   |     | x   |     | x   |     | x   |
| P2      |     | x   | x   |     |     | x   | x   |     |     | x   | x   |     |     | x   | x   |
| P4      |     |     |     | x   | x   | x   | x   |     |     |     |     | x   | x   | x   | x   |
| P8      |     |     |     |     |     |     |     | x   | x   | x   | x   | x   | x   | x   | x   |
| P16     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | x   |

The **Message** row indicates each bit of the codeword. The **Source** row indicates whether the original value of the bit is data (Dx) or parity (Px). The **Px** row indicates which bits are parity-checked.

There is no restriction on the length of the original data in this encoding method, and the above table can be extended to meet the requirements of any length of data. However, the general encoding will discuss a specific length ($2^n - 1$) for analytical convenience and simplicity. In the following, I will introduce two specific schemes, `Hamming (7, 4)` and `Hamming (11, 7)`.

## Hamming (7, 4)

The Hamming (7, 4) is a Hamming code with the encoded codeword length of 7 and the original data length of 4. It is encoded in the following way:

![Hamming (7, 4) encoding](/blog/hamming-code/hamming-encode-method.excalidraw.png)

For each bit of the original data, the value of the parity bits is obtained by first performing a **logical and** operation with the binary representation of its position in the final message, and then performing a **xor** operation together.

Here is an example of data `1001` to demonstrate the encoding and error correction. According to the above process, we can write the parity bits `[P4 P2 P1] = 011 ^ 111 = 100`, and the final codeword is `0011001`. Assuming an error in transmission, the received codeword is `0011101`. We can calculate the parity bits in a similar way `[P4 P2 P1] = 011 ^ 100 ^ 101 ^ 111 = 101`, i.e. the 5th bit is flipped. We can correct the error by flipping the 5th bit back to `0` and getting the original data `1001`.

We can also use matrixes to describe the encoding process:

$$
\begin{bmatrix}
  D_1 & D_2 & D_3 & D_4
\end{bmatrix}
\begin{bmatrix}
  1 & 1 & 1 & 0 & 0 & 0 & 0 \\
  1 & 0 & 0 & 1 & 1 & 0 & 0 \\
  0 & 1 & 0 & 1 & 0 & 1 & 0 \\
  1 & 1 & 0 & 1 & 0 & 0 & 1 \\
\end{bmatrix}
=
\begin{bmatrix}
  P_1 & P_2 & D_1& P_4  & D_2 & D_3 & D_4
\end{bmatrix}
$$

Here we call the intermediate matrix $G$ (_generator matrix_). The encoding process is just a matrix multiplication of the original data $d$ and $G$ to get the codeword $c$.

To detect and correct errors in the received codeword $r$, we can construct a matrix $H$ (_parity-check matrix_) by combining incremental binary numbers:

$$
H=
\begin{bmatrix}
  0 & 0 & 0 & 1 & 1 & 1 & 1 \\
  0 & 1 & 1 & 0 & 0 & 1 & 1 \\
  1 & 0 & 1 & 0 & 1 & 0 & 1 \\
\end{bmatrix}
$$

It's easy to see that the multiplication of $G$ and $H$ over a binary domain satisfies:

$$
G H^T = 0
$$

This means the if $r$ has no errors, then $r H^T = c H^T = d G H^T = 0$. If there is only one error in $r$, then the result of $r H^T$ must be non-zero and can be expressed as $(c + e) H^T = e H^T$. $e$ is the binary representation of the error position in the codeword (_error pattern_), i.e., $e$ contains only one 1 identifying the error position and all other bits are 0. The error position can be obtained by calculating the parity bits of $e$ and comparing them with the parity bits of $r$. The error can be corrected by flipping the bit in the error position. Then the result of $e H^T$ is the binary representation of the error position in the codeword and we can correct the error by using the index of this position.

## Systematic Hamming (7, 4)

The previous encoding method is not systematic, i.e., the original data is mixed with parity bits. We call this method **non-systematic code**. We can also separate the data and parity bits to form a **systematic code**. The generation matrix of the systematic Hamming (7, 4) can be obtained by performing primitive column transformation on $G$:

$$
G =
\begin{bmatrix}
  1 & 0 & 0 & 0 & 1 & 1 & 0  \\
  0 & 1 & 0 & 0 & 1 & 0 & 1  \\
  0 & 0 & 1 & 0 & 0 & 1 & 1  \\
  0 & 0 & 0 & 1 & 1 & 1 & 1  \\
\end{bmatrix}
$$

As for $H$, we can also perform primitive transformation:

$$
H =
\begin{bmatrix}
  1 & 1 & 0 & 1 & 1 & 0 & 0 \\
  1 & 0 & 1 & 1 & 0 & 1 & 0 \\
  0 & 1 & 1 & 1 & 0 & 0 & 1 \\
\end{bmatrix}
$$

However, after changing to systematic code, the result of $e H^T$ clearly agrees with the non-systematic code, i.g., **it is not the representation of the error position of the systematic code**. In fact, for more general systematic codes, the error pattern $e$ cannot be introduced with certainty from the result of $s = r H^T = e H^T$. It is common to create a decoding table based on the probability of the occurrence of each error pattern, and then use the decoding table to find the error position.

More generally, if we expand the coding scheme from a narrow Hamming design to a broad, linear grouping code with ere correction capability of 1 bit, then we are not limited to $G$ and $H$ as described above. We simply use the characteristic of the parity-check matrix of Hamming codes to construct a matrix for (n, k) codes by arranging the n-k different binary numbers into the columns of the matrix. Then we perform transformations on the matrix to obtain $H = \begin{bmatrix}P^T & I_{n-k}\end{bmatrix}$, which in turn gives us the generator matrix $G = \begin{bmatrix}I_k & P\end{bmatrix}$.

## Hamming (11, 7)

Let's take a look at a more general Hamming code. Hamming (11, 7) can be used for non-extended ASCII. We can construct generator matrix $G$ and parity-check matrix $H$ in the same way as Hamming (7, 4). The generator matrix is:

$$
G =
\begin{bmatrix}
  1 & 1 & 1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
  1 & 0 & 0 & 1 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
  0 & 1 & 0 & 1 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
  1 & 1 & 0 & 1 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
  1 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 \\
  0 & 1 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 1 & 0 \\
  1 & 1 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 1 \\
\end{bmatrix}

H =
\begin{bmatrix}
  0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 & 1 & 1 \\
  0 & 0 & 0 & 1 & 1 & 1 & 1 & 0 & 0 & 0 & 0 \\
  0 & 1 & 1 & 0 & 0 & 1 & 1 & 0 & 0 & 1 & 1 \\
  1 & 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 & 0 & 1 \\
\end{bmatrix}
$$

Then we can perform transformations to obtain matrixes for systematic code:

$$
G =
\begin{bmatrix}
  1 & 0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 & 0 & 0 \\
  0 & 1 & 0 & 0 & 0 & 0 & 0 & 1 & 0 & 1 & 0 \\
  0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 & 1 & 1 & 0 \\
  0 & 0 & 0 & 1 & 0 & 0 & 0 & 1 & 1 & 1 & 0 \\
  0 & 0 & 0 & 0 & 1 & 0 & 0 & 1 & 0 & 0 & 1 \\
  0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 & 1 & 0 & 1 \\
  0 & 0 & 0 & 0 & 0 & 0 & 1 & 1 & 1 & 0 & 1 \\
\end{bmatrix}

H =
\begin{bmatrix}
  1 & 1 & 0 & 1 & 1 & 0 & 1 & 1 & 0 & 0 & 0 \\
  1 & 0 & 1 & 1 & 0 & 1 & 1 & 0 & 1 & 0 & 0 \\
  0 & 1 & 1 & 1 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
  0 & 0 & 0 & 0 & 1 & 1 & 1 & 0 & 0 & 0 & 1 \\
\end{bmatrix}
$$

The general Hamming code is not that different from Hamming (7, 4), except there is a little difficulty when analyze the information entropy and other capabilities of the code. This is not a problem I will discuss here. So that's all for Hamming codes. I hope you enjoyed this post. If you have any questions, please leave a comment below.

# Reference

1. 曹雪虹 信息论与编码[M]. 第 3 版. 北京: 淸华大学出版社, 2016.
