# Geant4 UI command - /control/alias


Geant4 UI command 중, 자주 반복되는 문구를 간단하게 줄여주는 명령어. "/control/alias"에 대해 알아봅니다.

<!--more-->

## 개요

`/control/alias` 명령어는 **특정 문구를 반복적으로 사용**해야 할 때, 별명을 지어주는 명령어입니다.



---



## 사용법

### 별명 지어주기

별명을 지어줄 때에는 `/control/alias 별명 원래내용`의 형태로 입력합니다.

예를 들어, `/tracking/verbose`라는 명령어를 `tv`로 줄여서 사용하고 싶다면 다음과 같이 입력합니다.

```bash
/control/alias tv /tracking/verbose
```

{{< admonition note >}}

만약 입력하는 내용에 띄어쓰기가 포함되어 있다면, ""(double-quote)로 묶어서 입력합니다.

{{< /admonition >}}

### 별명 사용하기

앞서 부여한 별명을 사용할 때에는 `{별명}`의 형태로 입력합니다.

예를 들어 앞서 부여한 `tv`별명을 활용하려면 다음과 같이 입력합니다.

```bash
# 다음은 /tracking/verbose 1과 동일합니다.
{tv} 1
```



---



## 중요한 특징

1. alias로 호출되어 불려온 값은 무조건 string 형태로 인식합니다.

2. 명령어만 별명을 부여할 수 있는 것이 아닙니다. 어떤 문자열이든 별명을 부여해줄 수 있습니다.

3. alias된 값을 중첩하여 불러올 수도 있습니다.

   예시)

   ```bash
   /control/alias file1 /diskA/dirX/fileXX.dat
   /control/alias file2 /diskA/dirY/fileYY.dat
   /control/alias run 1
   
   /myDirectory/myCommand {file{run}}
   # /myDirectory/myCommand /diskA/dirX/fileXX.dat 와 동일
   # run의 alias 값을 참조하여 /myDirectory/myCommand {file1} 로 변환됨.
   # file1의 alias 값을 참조하여 /myDirectory/myCommand /diskA/dirX/fileXX.dat 로 변환됨.
   ```

   <b>/control/loop, /control/foreach 명령어와 조합하여 응용하면 상당히 강력한 효과를 얻을 수 있습니다.</b>
