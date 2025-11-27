---
title: Python学习笔记：最最基础的数据处理
description: 本文为高中“信息技术”课的笔记
date: 2025-10-16 23:50:12
updated: 2025-10-16 23:50:12
categories:
  - 杂谈
tags:
  - Python
  - 笔记
  - 高中
---
## 变量

变量用来储存数据，可以理解为贴了标签的盒子。  

```python
x = 10
y = 5
name = "VacuolePao"
```

- 等号左边是变量名，右边是数据。
- 变量名不能以数字开头，也不能包含空格。
- Python 会自动判断类型，不需要写 int、str 之类的关键字。

## print 输出

`print()` 用来输出内容到屏幕上，是最基础的显示方式。

```python
print("Hello, Python!")
print(x)
print("x 的值是：", x)
```

多个内容之间用逗号隔开，会自动加空格。

```python
print("我有", x, "个苹果")
```

输出结果是：`我有 10 个苹果`

## input 输入

`input()` 可以让程序暂停，等待用户输入。输入的内容默认是“字符串类型（str）”。

```python
name = input("请输入你的名字：")
print("你好，", name)
```

如果要输入数字并参与计算，需要用 `int()` 转换：

```python
age = int(input("请输入你的年龄：")) 
print("你明年就", age + 1, "岁了")
```


## 运算

Python 支持基本的算术运算：

| 运算符 | 含义        | 示例            |
| --- | --------- | ------------- |
| +   | 加法        | `3 + 2` → 5   |
| -   | 减法        | `7 - 4` → 3   |
| *   | 乘法        | `6 * 2` → 12  |
| /   | 除法（结果是小数） | `7 / 2` → 3.5 |
| //  | 整除（取商）    | `7 // 2` → 3  |
| %   | 取余（取余数）   | `7 % 2` → 1   |
| **  | 幂运算       | `2 ** 3` → 8  |

## 文本组合

字符串之间可以用加号拼接：

```python
name = "Alice"
msg = "你好，" + name + "！"
print(msg)
```

也可以用 f-string，更简洁：

```python
name = "Alice"
age = 16
print(f"{name} 今年 {age} 岁")
```

## 列表

列表用方括号 `[]` 表示，是存放多个数据的容器。

```python
scores = [85, 90, 78, 92]
names = ["张三", "李四", "王五"]
```

常用数据处理操作：

```python
scores.append(100)  # 追加一个元素
print(scores)

print(max(scores))  # 最大值
print(min(scores))  # 最小值
print(sum(scores) / len(scores))  # 平均数
print(len(scores))  # 列表中数据个数
```

可以通过索引访问数据**（从0开始）** ：

```python
print(names[0])  # 第一个元素
print(names[-1])  # 最后一个元素
```

## 拆分字符串为列表

```python
data = "1 2 3 4 5"
nums = data.split()  # 默认以空格分割
print(nums)
```

输出：

```python
['1', '2', '3', '4', '5'] # 每个数据有引号，是字符串类型
```

但这里的每个元素都是字符串，无法进行运算，如果要转换成整数，用 `map()`：

```python
nums = list(map(int, data.split()))
print(nums)
```

输出：

```python
[1, 2, 3, 4, 5]
```

结合 `input()`，可以让用户输入一行数字：

```python
nums = list(map(int, input("请输入数字，用空格分开：").split()))
print("你输入了", len(nums), "个数字")
print("平均值为", sum(nums) / len(nums))
```

