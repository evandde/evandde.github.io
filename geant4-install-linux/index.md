# Geant4 설치가이드 모음 (Linux)


Geant4는 매질을 통과하는 입자의 수송과정을 시뮬레이션하기 위한 C++ 기반 툴킷입니다. 
이 글에서는 Geant4 설치에 관한 다양한 정보와, 설치가이드 링크를 제공합니다.

<!--more-->



---



## TL;DR

### Ubuntu 20.04 LTS

<b>[10.6 patch-02 설치가이드]({{< ref "g4install-106p2-ubt2004" >}})</b>

- cmake 이용 (ccmake는 사용하지 않음)
- multi-threading 기능 활성화
- 외부 라이브러리 Qt5 (그래픽/UI 라이브러리) 연동
- 외부 라이브러리 OpenGL (그래픽) 연동
- CLHep 내장 라이브러리 사용
- Cross-section Data 설치 중 자동 다운로드

<b>[10.7 patch-01 설치가이드]({{< ref "g4install-107p1-ubt2004" >}})</b>

- cmake/ccmake 이용
- multi-threading 기능 활성화
- 외부 라이브러리 Qt5 (그래픽/UI 라이브러리) 연동
- 외부 라이브러리 OpenGL (그래픽) 연동
- 외부 라이브러리 CLHep 연동
- Cross-section Data 직접 다운받아 준비

<b>[Windows 10에서 WSL 활용하여 10.7 patch-01 설치하기(초보자용)]({{< ref "g4install-107p1-win10wslbasic" >}})</b>

- Windows 10 환경에서 WSL1 설치부터 진행
- cmake 이용 (ccmake는 사용하지 않음)
- multi-threading 기능 활성화
- 외부 라이브러리 Qt5 (그래픽/UI 라이브러리) 연동
- 외부 라이브러리 OpenGL (그래픽) 연동
- CLHep 내장 라이브러리 사용
- Cross-section Data 설치 중 자동 다운로드



---



## 설치 가이드 읽기

### 설치 가이드 위치

제가 설치 예시 글을 통해 설명드릴 수 있는 내용은 제한적입니다. 그러므로 설치 가이드가 어디에 있으며, 그 가이드에서 무엇을 살펴봐야 하는지 알려드리도록 하겠습니다.

우선 설치 가이드는 다음의 과정을 따라가시면 확인할 수 있습니다.

1. [Geant4 공식 홈페이지](http://geant4.web.cern.ch/) 접속

2. 화면 중간의 **User Support** 탭에 있는 [guides](http://geant4.web.cern.ch/support/user_documentation) 클릭

3. 이후 나오는 User Documentation 페이지에서, [Installation Guide: For setting up Geant4 in your computing environment](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/InstallationGuide/html/index.html)를 클릭 (pdf로 다운받거나, 혹은 이전 버전의 것을 볼 수도 있음)

4. **설치 가이드에 도착!**

{{< image src="G4InstallGuide.png" width=100% >}}

### 설치 필수/선택 사항 확인하기(Getting Started)

이 가이드에서 가장 먼저 보셔야할 부분은 **Getting Started** 탭입니다. 이 곳에는 설치에 필요한 **필수 사항**과, 꼭 필요하지는 않지만 편의에 따라 연동 가능한 **선택 사항**에 대한 요구조건이 적혀있습니다.

#### 필수 사항

맨처음에 나오는 **OS/Software Prerequisites**는 **필수 사항**에 대한 설명입니다.

몇 가지 부분만 추려서 적어보겠습니다.

{{< admonition quote >}}

**OS/Software Prerequisites**

- Geant4 Toolkit [소스 코드](https://geant4.web.cern.ch/support/download)
- C++ 컴파일러 및 C++11 표준을 지원하는 표준 라이브러리
  - Linux의 경우에는 [GNU Compiler Collection](http://gcc.gnu.org/)(GCC) 4.9.3 이상
    - 패키지 관리 시스템에서 기본 제공하는 GCC 컴파일러를 사용할 것을 강력히 권장함 (기본 제공 컴파일러가 버전 미달이면 따로 설치)
- [CMake](https://cmake.org/) 3.8 이상
  - 패키지 관리 시스템에서 기본 제공하는 CMake를 사용할 것을 권장함 (기본 제공 CMake가 버전 미달이면 따로 설치하되, [CMake 공식 다운로드 페이지](https://cmake.org/download/)에서 제공하는 binary 실행파일을 통한 최신버전 설치를 권장함)

{{< /admonition >}}

#### 선택 사항

다음으로 살펴야 할 내용은 **Prerequisites for Optional Components of Geant4** 입니다. 이는 **선택 사항**에 대한 설명입니다. 연동하여 설치할 수 있는 다양한 라이브러리가 제시되어 있습니다.

먼저 CLHEP, Expat, zlib 관련 내용입니다.

{{< admonition quote >}}

**CLHEP, Expat and zlib Support Libraries**

- [CLHEP](http://cern.ch/clhep/), [Expat](https://libexpat.github.io/), [zlib](https://zlib.net/)의 경우, Geant4에서 요구하는 최소한의 내용은 내장되어 있음
- 다만 Linux와 macOS용 버전에는 Expat이 내장되어 있지 않으므로 별도 설치가 요구됨
- 사용자가 해당 라이브러리의 기능을 더욱 확장하여 사용하고자 하는 경우 추가적으로 연동하여 설치

{{< /admonition >}}

위 내용 상, Linux에서 Geant4를 설치하는 경우에는 **Expat은 필수 사항**으로 봐도 무방합니다. 

다음은 GDML 부분(**GDML XML Geometry Support**)입니다. 이는 Geometry 입출력을 위한 라이브러리 중 하나입니다만, 여기서는 생략하겠습니다.

다음은 그래픽 및 UI 사용을 위해 대부분 연동하여 설치하는 UI 및 가시화 관련 내용(**User Interface and Visualization Drivers**)입니다.

여기서는 대표적으로 많이 사용되는 Qt 라이브러리 관련 내용만 적겠습니다.

{{< admonition quote >}}

**User Interface and Visualization Drivers**

아래에 나열한 패키지의 설치와 더불어, 사용자 시스템에 사용된 그래픽카드(NVIDIA 등)의 드라이버를 설치할 것을 강력히 권고합니다.

- Qt UI 및 가시화 관련(모든 플랫폼)
  - [Qt5](https://www.qt.io/download-qt-for-application-development) 헤더 및 라이브러리(Qt4는 이제 사용하지 않음)
  - [OpenGL](https://www.opengl.org/) 혹은 [MesaGL](https://www.mesa3d.org/)의 헤더 및 라이브러리
- X11 OpenGL 가시화 관련(Linux, macOS)
  - X11 헤더 및 라이브러리
  -  혹은 [MesaGL](https://www.mesa3d.org/)의 헤더 및 라이브러리

...

{{< /admonition >}}

이 외에도 다양한 UI 및 가시화 옵션이 있으니 참고하시기 바랍니다.

### 설치 옵션 확인하기

설치 가이드에서 다음으로 확인하셔야 할 부분은 **Building and Installing** 탭입니다. 이 곳에는 여러분이 설치를 진행할 때, 어떤 옵션을 어떻게 주어야 원하는 조건에 따라 설치가 가능한 지에 대해 설명되어 있습니다.

운영체제에 따라 핵심적인 설치 방법이 따로 정리되어 있습니다.

특히, **Geant4 Build Option** 부분에 여러분이 추가옵션을 설정하는 방법이 기재되어 있습니다. 나중에 기회가 되신다면 이 부분을 살펴보시는 것도 좋습니다.

여기서는 자주 사용되는 몇 가지만 다루겠습니다.

{{< admonition quote >}}

**Geant4 Build Option**

...

설치 시 다양한 옵션을 `cmake` 명령어에서 `-D` 플래그를 통해 설정할 수 있습니다.

예를 들면, 다음과 같이 명령줄을 입력하면 설치경로(`CMAKE_INSTALL_PREFIX`)를 `/opt/geant4`로 설정하고, GDML을 지원하게끔 설치하게 됩니다.

```bash
cmake -DCMAKE_INSTALL_PREFIX=/opt/geant4 -DGEANT4_USE_GDML=ON /path/to/geant4-source
```

...

CMake는 Curses (UNIX 한정)나 Qt (UNIX 혹은 Windows) 기반의 터미널/GUI 형태의 인터페이스도 제공하고 있으므로, 이를 활용하여 다양한 옵션을 살펴보고 설정할 수 있습니다.

**Standard Options**

* `CMAKE_INSTALL_PREFIX`
  * Geant4가 설치될 경로. Autotools에서의 `--prefix`와 동일.
  * Unix 시스템의 기본값은 `/usr/local`.
  * 절대경로로 입력하기를 권장.

...

- `GEANT4_BUILD_MULTITHREADED`
  - 기본값은 `OFF`.
  - `ON`으로 설정되면, Geant4 라이브러리가 multi-threading을 지원하도록 빌드함.
- `GEANT4_INSTALL_DATA`
  - 기본값은 `OFF`.
  - `ON`으로 설정되면, Geant4 설치 및 사용에 필요한 크로스섹션 데이터를 `GEANT4_INSTALL_DATADIR`에서 찾아본 뒤, 부족한 데이터를 자동으로 인터넷에서 다운받은 뒤 압축을 풀어 `GEANT4_INSTALL_DATADIR`에 넣고 설치를 진행함.
- `GEANT4_INSTALL_DATADIR`
  - 기본값은 `CMAKE_INSTALL_DATAROOTDIR`. 설치경로의 `share/` 임.
  - Geant4 설치 및 사용에 필요한 크로스섹션 데이터를 이 경로에서 탐색함.

...

- `GEANT4_USE_QT`
  - 기본값은 `OFF`.
  - `ON`으로 설정되면, Qt5 UI 및 가시화 라이브러리를 연동하여 빌드함.
  - 경로 관련 문제가 발생하면, Advanced Options 부분의 `CMAKE_PREFIX_PATH` 항목을 참고.
- `GEANT4_USE_OPENGL_X11`
  - 기본값은 `OFF`.
  - `ON`으로 설정되면, X11 OpenGL 가시화 라이브러리를 연동하여 빌드함.

...

{{< /admonition >}}

이외에도 정말 많은 옵션이 있습니다. 각 옵션마다 요구사항도 있으므로 주의해서 살펴보시기 바랍니다.



