# Visual Studio Code에서 CMake 환경 설정하기


VSCode에서 CMake 기반의 프로젝트를 만들고, 실행/디버깅 등이 가능한 환경을 구축하는 방법에 대해 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 VSCode 설치 후, <b>C++ 언어를 사용하기 위한 환경 구축까지 완료한 상태</b>라고 가정합니다. C++ 언어 사용을 위한 환경 구축은 [이 글]({{< ref "vscode-cpp" >}})을 참고하세요.

{{< /admonition >}}




---



## CMake 설치

VSCode는 CMake를 자체적으로 내장하고있지 않습니다. 때문에 CMake를 직접 설치하고 이를 연동해주는 작업이 필요합니다.

{{< admonition warning >}}

Extension을 설치한다고 해서 CMake가 설치되는 것은 아닙니다.

{{< /admonition >}}

### Windows를 이용하는 경우

Chocolatey를 이용하면 쉽게 설치할 수 있습니다. 다만, chocolatey로 CMake를 설치하는 경우 `PATH` 환경변수가 자동으로 잡히지 않아, 추가적인 명령어를 입력해주어야 합니다. 다음 명령어를 입력하세요.

{{< admonition info >}}

Chocolatey는 Windows용 패키지 관리자입니다. 아직 사용 방법을 모르신다면, [이 글]({{< ref "chocolatey" >}})을 참고하세요.

{{< /admonition >}}

```powershell
choco install cmake -y --installargs 'ADD_CMAKE_TO_PATH=System'
```

{{< image src="cmake_windows.png" width=100% >}}

다음 명령어를 통해 설치가 잘 되었는지 확인해보세요.

```powershell
cmake --version
```

{{< admonition tip >}}

Chocolatey 특성 상, 설치한 직후에는 `cmake` 명령어를 인식하지 못할 수 있습니다.

PowerShell을 껐다 켜거나, `refreshenv` 명령어를 활용하세요.

{{< /admonition >}}

{{< image src="cmake_version_windows.png" width=80% >}}

### Linux를 이용하는 경우

[apt(apt-get)](https://salsa.debian.org/apt-team/apt)나 [yum](http://yum.baseurl.org/index.html)을 이용하면 쉽게 설치할 수 있습니다.

예를 들어 `apt`를 이용하여 설치한다면 다음 명령어를 입력합니다.

```bash
sudo apt install cmake -y
```

{{< image src="cmake_linux.png" width=80% >}}

다음 명령어를 통해 설치가 잘 되었는지 확인해보세요.

```bash
cmake --version
```

{{< image src="cmake_version_linux.png" width=70% >}}

---

## Extension 설치

이제 VSCode에서 extension을 설치할 차례입니다.

VSCode를 켜고 extension 탭으로 간 뒤 “**cmake**“를 검색하세요. 맨 위부터 **CMake**와 **CMake Tools**가 뜰 것입니다. 두 가지 모두 Install 버튼을 눌러 설치합니다.

{{< image src="extension_cmake.png" width=100% >}}

각각의 용도는 이렇습니다.

- CMake extension: CMake 명령어에 대한 자동완성 제공. CMakeLists.txt 파일 작성에 도움.
- CMake Tools extension: CMake 기반 프로젝트를 관리하는데에 도움.

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

이는 CMake Tools extension이 직접 지원하지 않기 때문에, 우리가 <b>launch.json 파일을 생성</b>해 주어야 합니다.

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

#### launch.json 자동생성

이제 launch.json 파일을 만들어 보겠습니다. 다음 그림과 같이 진행해주세요.

{{< admonition note >}}

직접 작성하는 것이 아니라, VSCode의 기능을 통해 자동으로 기본 틀이 작성되도록 할 것입니다.

{{< /admonition >}}

{{< image src="arg2.png" width=100% >}}

{{< image src="arg3.png" width=100% >}}

{{< image src="arg4.png" width=100% >}}

{{< image src="arg5.png" width=100% >}}

{{< image src="arg6.png" width=100% >}}

#### 필요없는 파일 삭제

위 과정을 거치면, .vscode/launch.json, .vscode/tasks.json, main.exe의 세 파일이 생성됩니다.

이 중 <b>.vscode/tasks.json</b>, <b>main.exe</b> 파일은 필요가 없고 사용하지 않을 것이니 **삭제**해줍니다.

{{< image src="arg7.png" width=100% >}}

#### launch.json 수정

이제 실행/디버깅에 사용되는 launch.json 파일을 수정합니다.

1. program 변수의 값을 "${command:cmake.launchTargetPath}"로 변경

   {{< admonition info >}}

   cmake.launchTargetPath는 CMake Tools extension에서 제공하는 변수명으로, CMake project에서 컴파일하여 만든 실행파일의 경로를 의미합니다.

   {{< /admonition >}}

2. preLaunchTask 항목을 삭제 (**값만 지우는 것이 아니라 항목 전체를 삭제**)

   {{< admonition info >}}

   preLaunchTask는 tasks.json 파일을 통해 정의되는 선행작업입니다. CMake 기반 project에서는 tasks.json의 역할을 CMake Tools extension이 수행해주므로 이 부분은 사용하지 않습니다.

   {{< /admonition >}}

{{< image src="arg8.png" width=100% >}}

{{< image src="arg9.png" width=100% >}}

#### launch.json 파일을 통해 실행해보기

launch.json 파일을 통해 실행하기 위해서는, 다음 그림과 같이 <b>(Run) - (Run Without Debugging)</b> 항목을 클릭하면 됩니다.

{{< admonition info >}}

launch.json 파일을 통해 디버깅하기 위해서는, 바로 위의 (Run) - (Start Debugging) 항목을 클릭하면 됩니다.

{{< /admonition >}}

{{< image src="arg10.png" width=100% >}}

{{< image src="arg11.png" width=100% >}}

#### Command line argument 설정

이제 command line argument를 변경해보겠습니다.

아까 수정한 <b>launch.json 파일</b>에서 <b>args의 값</b>을 통해 설정합니다.

{{< image src="arg12.png" width=100% >}}

{{< image src="arg13.png" width=100% >}}



---

## Reference

https://chocolatey.org/packages/cmake

https://vector-of-bool.github.io/docs/vscode-cmake-tools/


