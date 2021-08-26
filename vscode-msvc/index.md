# Visual Studio Code에서 MSVC 기반 C++, CMake 환경 설정하기


VSCode에서 Microsoft Visual Studio 빌드 도구인 <b>MSVC</b>를 이용하여 <b>C/C++ 언어</b> 및 <b>CMake</b>를 사용하기 위한 환경을 구축하는 방법에 대해 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 <b>VSCode 설치를 완료한 상태</b>라고 가정합니다. VSCode 설치 및 기본 세팅은 [이 글]({{< ref "vscode" >}})을 참고하세요.

{{< /admonition >}}

{{< admonition warning >}}

MSVC는 Windows에서만 이용 가능합니다. Linux나 Mac을 이용하시는 경우에는 <b>gcc</b>와 같은 다른 대안을 이용하시기 바랍니다.

{{< /admonition >}}

---

## VS2019 빌드 도구 설치

VSCode는 C 언어용 컴파일러나 디버거를 자체적으로 내장하고있지 않습니다. 때문에 C 언어를 VSCode에서 사용하려면, 컴파일러와 디버거를 직접 설치하고 이를 연동해주는 작업이 필요합니다.

{{< admonition warning >}}

Extension을 설치한다고 해서 컴파일러나 디버거가 설치되는 것은 아닙니다.

{{< /admonition >}}

이 글에서는 Microsoft사에서 제공하는 MSVC(Microsoft Visual C++)를 이용하여 진행할 것입니다. 

### 다운로드

Microsoft에서 제공하는 Visual Studio 2019용 Build Tools는 [이 링크](https://visualstudio.microsoft.com/ko/downloads/#build-tools-for-visual-studio-2019)에서 무료로 받을 수 있습니다. 아래 그림에서 보이는 다운로드 링크를 누르면 됩니다.

{{< image src="vs2019buildtools_download.png" width=100% >}}

### 설치

다운받은 뒤 실행하면, 아래 그림과 같은 창이 뜰 것입니다. 이 중 <b>C++를 사용한 데스크톱 개발</b>을 클릭합니다. 오른쪽 설치 세부 정보에서, 자동으로 선택사항 중 일부가 선택될 것입니다. 혹시라도 <b>Windows용 C++ CMake 도구</b>가 선택이 안되어있다면, <b>꼭 선택</b>해주시기 바랍니다. 선택을 완료하셨다면 설치를 진행하시면 됩니다.

{{< image src="vs2019buildtools_install.png" width=100% >}}

### 실행

제대로 설치가 되었는지 확인해보겠습니다. 

1. <b>[WIN]+[S]</b> 를 눌러 검색을 띄움

2. `developer powershell`을 입력하여 <b>Developer PowerShell for VS 2019</b>를 찾은 뒤 실행

   {{< image src="vs2019buildtools_test1.png" width=100% >}}

3. `cl` 명령어와 `cmake` 명령어를 입력하여, 다음 그림과 같이 사용법(usage)이 뜨는지 확인

   {{< image src="vs2019buildtools_test2.png" width=100% >}}

이제 여러분은 MSVC에 포함된 C/C++ 빌드 도구 및 CMake 도구를 사용할 수 있게 되었습니다.

### VSCode 실행

VSCode와 MSVC를 연동하여 사용하고자 하는 경우에는, <b><font color=red>반드시 Developer PowerShell for VS 2019를 통해 VSCode를 실행시켜야만 합니다.</font></b> 그렇지 않으면, VSCode에서 MSVC 관련 툴을 인지하지 못합니다.

Developer PowerShell for VS 2019에서 VSCode를 실행시키는 법은 간단합니다. 다음 그림과 같이 `code`라는 명령어만 실행시키시면 됩니다.

{{< image src="vs2019buildtools_vscode.png" width=100% >}}

VSCode 창이 뜨면, <b>[File] - [Open Folder]</b>를 선택하여, 작업을 진행할 폴더를 선택해주시면 됩니다.

{{< image src="vscode_openfolder.png" width=100% >}}





---

## Extension 설치

이제 VSCode에서 extension을 설치할 차례입니다.

### C/C++

VSCode를 켜고 extension 탭으로 간 뒤 "**c**"를 검색하세요. 맨 위에 C/C++ extension이 뜰 것입니다. Install 버튼을 눌러 설치합니다.

{{< image src="extension_c.png" width=100% >}}

### CMake

이어서 CMake 관련 extension도 설치합니다.

VSCode를 켜고 extension 탭으로 간 뒤 “**cmake**“를 검색하세요. 맨 위부터 **CMake**와 **CMake Tools**가 뜰 것입니다. 두 가지 모두 Install 버튼을 눌러 설치합니다.

{{< image src="extension_cmake.png" width=100% >}}

각각의 용도는 이렇습니다.

- CMake extension: CMake 명령어에 대한 자동완성 제공. CMakeLists.txt 파일 작성에 도움
- CMake Tools extension: CMake 기반 프로젝트를 관리하는데에 도움



---

## 테스트

이제 제대로 설치가 되었는지 확인할 시간입니다.

{{< admonition warning >}}

경로에 **한글**이 있으면 제대로 동작하지 않습니다.

{{< /admonition >}}

### Hello world 프로젝트 만들어보기

CMake Tools는 <b>CMake: Quick Start</b>라는 기능을 제공합니다. 손쉽게 CMake 기반의 Hello world 프로젝트를 만들어주는 것이죠.

적당한 경로에 빈 폴더를 만들어주고 다음과 같이 진행합니다.

{{< image src="cqs1.png" width=100% >}}

{{< image src="cqs2.png" width=100% >}}

{{< image src="cqs3.png" width=100% >}}

{{< image src="cqs4.png" width=100% >}}

{{< image src="cqs5.png" width=100% >}}

{{< image src="cqs6.png" width=100% >}}

### 실행

다음 그림과 같이 실행하시면 됩니다. 동일 폴더 내에 <b>.vscode</b>라는 폴더가 생기고 그 안에 CMake 설정 등에 관한 `.json` 파일이 자동으로 생성될 것입니다. 또한, <b>build</b>라는 폴더가 생기고 그 안에 **CMake를 통한 빌드 부산물 및 컴파일 결과물**이 자동으로 생성될 것입니다.

이후 아래쪽의 **TERMINAL** 탭을 확인하시면, 자동 생성된 main.cpp의 내용대로 Hello, world!가 출력되는 것을 확인할 수 있습니다.

{{< image src="run1.png" width=100% >}}

{{< image src="run2.png" width=100% >}}

### 디버깅

다음 그림과 같이 진행하여 디버깅도 가능합니다. 

{{< admonition warning >}}

맨 처음 그림에서 보이는 바와 같이, CMake type을 Debug로 설정해야 함에 주의하세요!

{{< /admonition >}}

{{< image src="debug1.png" width=100% >}}

{{< image src="debug2.png" width=100% >}}

{{< image src="debug3.png" width=100% >}}

{{< image src="debug4.png" width=100% >}}

{{< image src="debug5.png" width=100% >}}

### Command line argument 설정

실행하거나 디버깅할 때, command line argument를 넘겨주도록 설정하고 싶을 때가 있습니다.

이는 <b>.vscode/settings.json 파일을 생성</b>해주고, 해당 파일에서 `cmake.debugConfig`인자로서 입력해줘야 합니다.

#### 테스트 코드 수정

그 전에 먼저 argument가 제대로 동작하는지 확인하기 위해 main.cpp 코드를 수정하겠습니다.

```cpp {hl_lines=[3,5]}
#include <iostream>

int main(int argc, char**) {
    std::cout << "Hello, world!\n";
    std::cout << "argc: " << argc << std::endl;
}
```

이 상태로 그냥 실행해보면 다음과 같이 나타날 것입니다.

{{< image src="arg1.png" width=100% >}}

#### settings.json

이제 settings.json 파일을 만들어 보겠습니다. (이미 만들어져 있을 수도 있습니다만, 그대로 진행하시면 됩니다)

다음 그림과 같이 File - Preferences - Settings를 클릭합니다. 단축키는 <b>[CTRL]+[,]</b> 입니다.

{{< image src="arg2.png" width=100% >}}

여기서 Workspace 탭을 클릭합니다. 이 프로젝트(workspace)에만 적용되는 설정항목이라는 뜻입니다.

{{< image src="arg3.png" width=100% >}}

상단 검색창에 `cmake.debugConfig`를 검색한 뒤, <u>Edit in settings.json</u> 부분을 클릭합니다. `cmake.debug` 정도만 입력하셔도 바로 뜰 것입니다.

{{< image src="arg4.png" width=100% >}}

클릭하시면 바로 다음과 같이 `.vscode/settings.json` 폴더 및 파일이 생성되고, settings.json 파일이 열리며, 그 안에 다음 그림과 같은 내용이 자동으로 작성되어 있을 것입니다. (추가로 다른 내용이 더 쓰여있을 수도 있습니다.)

{{< image src="arg5.png" width=100% >}}

이제 이 안에 `args` 항목을 만들어 command line argument를 설정합니다. 실행파일명 뒤에 이어질 추가적인 argument들만 적어주면 되며, 각 항목은 ""(double-quote)로 묶어주고 ,(comma)로 분리해주면 됩니다.

{{< image src="arg6.png" width=100% >}}

이제 저장한 뒤, 실행이나 디버깅을 해보면 다음과 같이 command line argument가 잘 반영된 것을 확인할 수 있습니다.

{{< image src="arg7.png" width=100% >}}
