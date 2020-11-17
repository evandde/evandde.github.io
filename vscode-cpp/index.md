# Visual Studio Code에서 C, C++ 환경 설정하기


VSCode에서 C 언어 및 C++ 언어를 사용하기 위해 실행/디버깅 등이 가능한 환경을 구축하는 방법에 대해 알아봅니다.


<!--more-->

{{< admonition success >}}

여기서는 <b>VSCode 설치를 완료한 상태</b>라고 가정합니다. VSCode 설치 및 기본 세팅은 [이 글]({{< ref "vscode" >}})을 참고하세요.

{{< /admonition >}}

---

## 컴파일러/디버거 설치

VSCode는 C 언어용 컴파일러나 디버거를 자체적으로 내장하고있지 않습니다. 때문에 C 언어를 VSCode에서 사용하려면, 컴파일러와 디버거를 직접 설치하고 이를 연동해주는 작업이 필요합니다.

{{< admonition warning >}}

Extension을 설치한다고 해서 컴파일러나 디버거가 설치되는 것은 아닙니다.

{{< /admonition >}}

### Windows를 이용하는 경우

Windows는 기본적으로 C 언어용 컴파일러나 디버거를 제공하지 않습니다. 따라서, 우리가 직접 설치해주어야 합니다.

이 글에서는 **[MinGW](http://www.mingw.org/)**[^1]를 이용하도록 하겠습니다. MinGW는 chocolatey를 통해 쉽게 설치할 수 있습니다.

{{< admonition info >}}

Chocolatey는 Windows용 패키지 관리자입니다. 아직 사용 방법을 모르신다면, [이 글]({{< ref "chocolatey" >}})을 참고하세요.

{{< /admonition >}}

```powershell
choco install mingw -y
```

{{< image src="mingw.png" width=100% >}}

다음 명령어를 통해 설치가 잘 되었는지 확인해보세요.

```powershell
gcc --version
gdb --version
```

{{< admonition tip >}}

Chocolatey 특성 상, 설치한 직후에는 `gcc`, `gdb` 명령어를 인식하지 못할 수 있습니다.

PowerShell을 껐다 켜거나, `refreshenv` 명령어를 활용하세요.

{{< /admonition >}}

{{< image src="gccgdb_version_windows.png" width=80% >}}

### Linux를 이용하는 경우

대부분의 Linux 배포판은 gcc[^2]와 gdb[^3]를 기본적으로 제공합니다.

터미널을 켜서 다음 명령어를 입력했을 때 버전 정보가 정상적으로 출력되면 설치되어 있는 것입니다.

```bash
gcc --version
gdb --version
```

{{< image src="gccgdb_version_linux.png" width=80% >}}

만약 설치가 되어있지 않다면, 패키지 관리자인 `apt`나 `yum`을 이용하여 설치하시기를 권장합니다.

---

## Extension 설치

이제 VSCode에서 extension을 설치할 차례입니다.

VSCode를 켜고 extension 탭으로 간 뒤 "**c**"를 검색하세요. 맨 위에 C/C++ extension이 뜰 것입니다. Install 버튼을 눌러 설치합니다.

{{< image src="extension_c.png" width=100% >}}



---

## 테스트

이제 제대로 설치가 되었는지 확인할 시간입니다.

{{< admonition warning >}}

경로에 **한글**이 있으면 제대로 동작하지 않습니다.

{{< /admonition >}}

### 코드 작성

Explorer 탭으로 이동하여 적당한 경로에 <b>main.cpp</b>라는 새 파일을 만들어주고 다음과 같이 작성하도록 하겠습니다.

```cpp
#include <iostream>

int main(int argc, char **)
{
    std::cout << "Hello, World!" << std::endl;
    std::cout << "argc: " << argc << std::endl;
}
```

{{< image src="codewriting.png" width=100% >}}

### 실행

다음 그림과 같이 실행하시면 됩니다. 동일 폴더 내에 <b>.vscode</b>라는 폴더가 생기고, 그 안에 컴파일 옵션에 관한 설정이 적힌 `.json` 파일이 자동으로 생성될 것입니다.

이후 아래쪽의 **TERMINAL** 탭을 확인하시면, 우리가 작성한대로 두 줄이 화면에 출력되는 것을 확인할 수 있습니다.

{{< admonition info >}}

C++이 아닌 **C 언어**로 작성하였다면, 세 번째 그림에서 g++.exe대신 <b>gcc.exe를 선택</b>하시면 됩니다.

아마 gcc.exe만 선택 가능하게끔 뜰 것입니다.

{{< /admonition >}}

{{< image src="run1.png" width=100% >}}

{{< image src="run2.png" width=100% >}}

{{< image src="run3.png" width=100% >}}

{{< image src="run4.png" width=100% >}}

{{< admonition warning >}}

실행을 하실 때, <b>main.cpp가 활성화된 상태에서 실행</b>하세요.

이 방법을 통해 자동으로 만들어진 launch.json 파일은 <b>"활성화된 파일의 이름.exe"</b>를 실행합니다.

예를들어 launch.json을 보면서 실행 버튼을 누르면, launch.exe를 찾아 실행하려고 하기 때문에 에러가 발생합니다.

{{< /admonition >}}

### 디버깅

다음 그림과 같이 진행하여 디버깅도 가능합니다.

{{< image src="debug1.png" width=100% >}}

{{< image src="debug2.png" width=100% >}}

{{< image src="debug3.png" width=100% >}}

{{< image src="debug4.png" width=100% >}}

{{< image src="debug5.png" width=100% >}}

### Command line argument 설정

실행하거나 디버깅할 때, command line argument를 넘겨주도록 설정하고 싶을 때가 있습니다.

이 부분은 아까 자동으로 만들어졌던 <b>launch.json</b> 파일의 <b>args 값</b>을 통해 설정합니다.

{{< image src="args1.png" width=100% >}}

{{< image src="args2.png" width=100% >}}

{{< image src="args3.png" width=100% >}}

{{< image src="args4.png" width=100% >}}



[^1]: Minimalist GNU for Windows. 마이크로소프트 Windows로 포팅한 GNU 소프트웨어 도구 모음
[^2]: GNU Compiler Collection. 혹은 그 중 하나인 GNU C Compiler. C 언어 컴파일러의 일종.
[^3]: GNU Debugger. C 언어 디버거의 일종.
