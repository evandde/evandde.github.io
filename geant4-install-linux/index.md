# Linux에서 Geant4 설치하기


Geant4는 매질을 통과하는 입자의 수송과정을 시뮬레이션하기 위한 C++ 기반 툴킷입니다. 
이 글에서는 Linux계열 운영체제 중 하나인 **Ubuntu 20.04 LTS**에서 **Geant4 10.6 patch 02 버전**을 설치하는 방법에 대해 알아봅니다. 

<!--more-->



설치 과정이 좀 깁니다. 차근차근 읽으며 진행해보시기 바랍니다.
설치에 대한 세부 옵션은 다음과 같습니다.
- **multi-threading 기능을 활성화**
- **Qt5**(외부 라이브러리) 연동
- **X11 OpenGL**(외부 라이브러리) 연동

보다 상세한 내용은 아래를 참고하세요

{{< admonition warning >}}

이 글은 **인터넷 연결이 되어있으며**, Linux의 관리자 권한인 **sudo 권한이 있다**는 가정 하에서 설치를 진행합니다.

{{< /admonition >}}



---



## TL;DR

### Geant4 관련 필수/선택 라이브러리 설치

1. `apt` 패키지 매니저 최신화

   ```bash
   sudo apt update -y && sudo apt upgrade -y && sudo apt autoremove -y
   ```

2. `apt`를 이용하여 다음 항목 설치

   -  C++ 컴파일러 및 표준 라이브러리, 헤더 (<font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - CMake (<font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - Expat (Linux, macOS에서 <font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - Qt5, X11 OpenGL 라이브러리 설치 (Geant4 설치 시 선택 라이브러리. GUI 등 그래픽 기반 기능 사용에 필요)

   ```bash
   sudo apt install -y build-essential cmake libexpat1-dev qt5-default libxmu-dev
   ```

### Geant4 설치

1. Geant4 툴킷을 설치할 디렉토리 생성

   ```bash
   sudo mkdir -p /opt/geant4/10.6.p02
   ```

2. 1에서 생성한 디렉토리로 이동하여, Geant4 소스코드 다운로드 (소스코드 용량 약 40 MB)

   ```bash
   cd /opt/geant4/10.6.p02
   sudo wget http://geant4-data.web.cern.ch/geant4-data/releases/geant4.10.06.p02.tar.gz
   ```

3. 2에서 다운받은 압축파일을 압축해제 후 디렉토리명을 `source`로 변경

   ```bash
   sudo tar -xf geant4.10.06.p02.tar.gz
   ```
   
4. `build`라는 이름의 디렉토리를 만들고 안으로 이동

   ```bash
   sudo mkdir build
   cd build
   ```

5. 컴파일 수행 (`make` 명령은 인터넷 속도 및 cpu 성능에 따라 수 분~수 십분 소요될 수 있음)

   - `CMAKE_INSTALL_PREFIX`(설치경로): `/opt/geant4/10.6.p02`
   - `GEANT4_BUILD_MULTITHREADED`(multi-threading 사용 여부): ON
   - `GEANT4_INSTALL_DATA`(크로스섹션 데이터 자동설치 여부): ON (데이터 총 용량 약 900 MB)
   - `GEANT4_USE_OPENGL_X11`(X11 OpenGL 라이브러리 연동 여부): ON
   - `GEANT4_USE_QT`(QT 라이브러리 연동 여부): ON

   ```bash
   sudo cmake ../geant4.10.06.p02 -DCMAKE_INSTALL_PREFIX=/opt/geant4/10.6.p02 -DGEANT4_BUILD_MULTITHREADED=ON -DGEANT4_INSTALL_DATA=ON -DGEANT4_USE_OPENGL_X11=ON -DGEANT4_USE_QT=ON
   sudo make -j `grep -c processor /proc/cpuinfo`
   sudo make install
   ```

6. 환경변수 세팅을 위해 `~/.bashrc`에 내용 추가

   ```bash
   echo "source /opt/geant4/10.6.p02/bin/geant4.sh" >> ~/.bashrc
   ```



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

우리가 설치할 환경인 Ubuntu 20.04 환경에 대한 부분만 추려서 적어보겠습니다.

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

위 내용 상, Linux에서 Geant4를 설치하는 경우에는 **Expat은 필수 사항**으로 봐도 무방합니다. 따로 설치해주어야 하겠군요.

다음은 GDML 부분(**GDML XML Geometry Support**)입니다만, 이는 설치하지 않을 것입니다. (Geometry 입출력을 위한 라이브러리 중 하나입니다)

다음은 우리가 연동하려고 생각하고 있는 UI 및 가시화 관련 내용(**User Interface and Visualization Drivers**)입니다.

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

이를 바탕으로 **Qt5 라이브러리**와 **X11 OpenGL 헤더 및 라이브러리**를 추가로 연동하여 설치할 것입니다.

### 설치 옵션 확인하기

설치 가이드에서 다음으로 확인하셔야 할 부분은 **Building and Installing** 탭입니다. 이 곳에는 여러분이 설치를 진행할 때, 어떤 옵션을 어떻게 주어야 원하는 조건에 따라 설치가 가능한 지에 대해 설명되어 있습니다.

운영체제에 따라 핵심적인 설치 방법이 따로 정리되어 있습니다.

특히, **Geant4 Build Option** 부분에 여러분이 추가옵션을 설정하는 방법이 기재되어 있습니다. 나중에 기회가 되신다면 이 부분을 살펴보시는 것도 좋습니다.

여기서는 저희가 활용할 옵션들 위주로 살펴보겠습니다.

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



---



## 설치하기

이제 가이드를 다 읽어봤으니, 본격적으로 설치를 진행하겠습니다.

우리가 설치하는 환경과 대상을 먼저 정리하면 다음과 같습니다.

**설치 환경**

- 운영체제: Ubuntu 20.04 LTS
- 인터넷 사용 가능.
- 관리자 권한 (`sudo`) 이용 가능.

**설치 대상**

- Geant4 10.6 patch 02 버전.
- Multi-threading 기능 활성화.
- UI 및 가시화 기능 활용을 위해 Qt5, X11 OpenGL 라이브러리 연동하여 설치.

**설치 경로**

- `/opt/geant4/10.6.p02`
- 여러 버전의 Geant4를 설치할 경우를 고려하여, `/opt/geant4` 하위에 버전별로 디렉토리를 만들고 그 하위에 설치 진행.

이를 바탕으로, 설치를 시작하기 전에 먼저 준비해야할 것들은 다음과 같습니다.

- Geant4 Toolkit [소스 코드](https://geant4.web.cern.ch/support/download)
- [GNU Compiler Collection](http://gcc.gnu.org/)(GCC)
- [CMake](https://cmake.org/)
- [Expat](https://libexpat.github.io/)
- [Qt5](https://www.qt.io/download-qt-for-application-development)
- [OpenGL](https://www.opengl.org/)

소스 코드는 추후에 진행하며 다운을 받을 것이니, 나머지 5가지부터 설치하도록 하겠습니다.



---



### Prerequisite 설치

인터넷이 안된다거나, 관리자 권한을 사용할 수 없다거나, Ubuntu가 아니라면 이야기가 좀 달라지겠지만...

앞서 말한 5가지 준비물은 모두 Ubuntu에서 제공하는 패키지 관리자 `apt`를 통해 설치할 수 있습니다.

(RedHat 계열의 리눅스에서도 패키지 관리자 `yum`을 통해 유사한 명령어로 설치할 수 있습니다)

{{< admonition warning >}}

패키지 관리자를 사용하기 전에 최신화를 해주세요.

{{< /admonition >}}

{{< admonition danger >}}

본인이 **서버 등을 관리하는 사람**이라면, **최신화를 할 때 주의**하세요. 이런 경우에는 전체 패키지를 최신화하기보다는 **원하는 특정 패키지를 선별하여 최신화하기를 권장**합니다.

{{< /admonition >}}

#### 패키지 매니저 최신화

```bash
sudo apt update -y && sudo apt upgrade -y && sudo apt autoremove -y
```

#### C++ 컴파일러 및 표준 라이브러리, 헤더 설치 (GCC 등)

```bash
sudo apt install -y build-essential
```

#### CMake 설치

```bash
sudo apt install -y cmake
```

#### Expat 설치

```bash
sudo apt install -y libexpat1-dev
```

#### Qt5 설치

```bash
sudo apt install -y qt5-default
```

#### X11 OpenGL 설치

```bash
sudo apt install -y libxmu-dev
```



---



### Geant4 설치하기

이제 준비가 다 되었습니다. 이어서 Geant4를 설치해봅시다.

우리가 설치하고자 하는 경로는 `/opt/geant4/10.6.p02`입니다. 앞서 말씀드린 것처럼, 여러 버전의 Geant4를 설치할 경우를 고려하여 `/opt/geant4` 하위에 버전명에 해당하는 디렉토리를 두어 세분화한 것입니다.

#### 설치를 위한 디렉토리 생성

우선 해당 디렉토리를 생성하기 위해 다음 명령어를 입력합니다. (`/opt`는 관리자 권한이 있어야 수정할 수 있음)

```bash
sudo mkdir -p /opt/geant4/10.6.p02
```

#### Geant4 소스코드 다운로드

이어서, 해당 디렉토리로 이동한 뒤 Geant4 소스코드를 다운 받겠습니다.

```bash
cd /opt/geant4/10.6.p02
sudo wget http://geant4-data.web.cern.ch/geant4-data/releases/geant4.10.06.p02.tar.gz 
```

{{< admonition info >}}

`wget` 명령어를 사용하지 않고, [Geant4 다운로드 페이지](https://geant4.web.cern.ch/support/download)에서 직접 받아서 옮겨오셔도 괜찮습니다.

{{< /admonition >}}

{{< admonition tip >}}

본 글에서 다루는 10.6.p02와 다른 버전을 설치하시는 경우에는, `wget` 링크를 바꿔주셔야 합니다. 일반적으로 맨 뒤의 버전부분만 수정하면 됩니다.

{{< /admonition >}}

#### 소스코드 압축 해제

위 과정을 통해 `geant4.10.06.p02.tar.gz`라는 압축파일을 다운받으셨을 것입니다.

다음 명령어를 통해 해당 파일의 압축을 해제합니다.

```bash
sudo tar -xf geant4.10.06.p02.tar.gz
```

`geant4.10.06.p02`라는 디렉토리가 생성되고 그 안에 압축이 풀리게 됩니다.

#### 빌드를 위한 build 디렉토리 생성

빌드를 수행하면 CMake와 관련된 잡다한 부산물이 생성됩니다. 관리의 용이성을 위해, 별도의 `build`라는 디렉토리를 만들고 이 안에서 컴파일을 수행하겠습니다.

```bash
sudo mkdir build
cd build
```

#### 빌드 수행

우리는 빌드를 진행할 때 다음과 같은 옵션을 설정할 것입니다.

- `CMAKE_INSTALL_PREFIX`(설치경로): `/opt/geant4/10.6.p02`
- `GEANT4_BUILD_MULTITHREADED`(multi-threading 사용 여부): ON
- `GEANT4_INSTALL_DATA`(크로스섹션 데이터 자동설치 여부): ON (데이터 총 용량 약 900 MB)
- `GEANT4_USE_OPENGL_X11`(X11 OpenGL 라이브러리 연동 여부): ON
- `GEANT4_USE_QT`(QT 라이브러리 연동 여부): ON

그리고 우리의 소스 코드는 `../geant4.10.06.p02` 디렉토리에 압축이 풀려져 있지요.

이에 따라 다음과 같이 명령줄을 입력합니다.

```bash
sudo cmake ../geant4.10.06.p02 -DCMAKE_INSTALL_PREFIX=/opt/geant4/10.6.p02 -DGEANT4_BUILD_MULTITHREADED=ON -DGEANT4_INSTALL_DATA=ON -DGEANT4_USE_OPENGL_X11=ON -DGEANT4_USE_QT=ON
```

이 명령어를 입력하면, 많은 내용이 출력되며 작업이 진행됩니다. 혹시라도 오타가 나면 이 부분에서 에러가 발생합니다. <font color="red"><b>오타가 나지 않도록 주의하세요! 복사-붙여넣기 추천!</b></font>

{{< admonition note >}}

`GEANT4_INSTALL_DATA` 부분은 앞서 설명한 바와 같이, 크로스섹션 데이터를 자동으로 다운받을지에 대한 옵션입니다. 사용자에 따라 `OFF`로 하고 직접 다운로드 받아서 가져오는 경우도 있습니다.

이 글에서는 Geant4를 처음 설치하는 분들이 별도로 작업할 내용을 최소화하고자, 자동 다운로드 하는 방법으로 진행합니다.

{{< /admonition >}}

{{< admonition tip >}}

`ccmake` (curses 기반 CMake)를 사용할 수 있는 분이라면, 이를 이용하는 편이 더욱 편할 수도 있습니다. 이에 관한 내용은 지면이 부족하여 생략합니다. :(far fa-grin-squint-tears):

{{< /admonition >}}

다음과 같은 명령어와 함께 마무리되면 정상적으로 진행이 된 것입니다.

{{< image src="cmake_done.png" width=70% >}}

이어서 `make` 명령어로 빌드를 진행하고, `make install`로 설치를 마무리합니다.

```bash
sudo make
sudo make install
```

{{< admonition tip >}}

`make` 명령어는 `-j <쓰레드 수>` 옵션을 주면, 여러 쓰레드를 동시에 이용하여 좀 더 빨리 설치됩니다.

{{< /admonition >}}

{{< admonition warning >}}

`make` 명령어에서 `-j` 옵션을 주고 돌릴 때, 메모리가 부족한데 쓰레드 수가 너무 과하게 잡히면 `cc1plus` 관련 에러가 발생할 수 있습니다. `-j` 옵션에 적절한 숫자는 <b>자신의 쓰레드 수 * 1.2</b> 입니다.

{{< /admonition >}}

### 환경변수 설정

Geant4 툴킷을 설치하고나면 마지막으로 할 일이 있습니다. 바로 **환경변수를 설정**하는 것입니다.

Geant4는 관련하여 설정할 환경변수 등 설정해야 하는 내용이 여럿 있는데요, 이를 정리하여 한 번에 자동으로 설정이 되게끔하는 파일을 Geant4에서 제공하고 있습니다.

설치경로의 내부에 `bin/geant4.sh`라는 파일입니다. (C-shell을 이용하시는 분은 `bin/geant4.csh`를 이용합니다)

{{< admonition info >}}

Geant4가 여러 버전으로 설치되어 있는 경우, 원하는 버전의 `bin/geant4.sh`를 실행함으로써 해당 버전으로 동작하도록 설정할 수 있습니다.

{{< /admonition >}}

실행을 위해서는 다음 명령어를 입력합니다. (`source` 명령어 뒤에 오는 경로는 Geant4를 설치한 경로에 따라 바뀔 수 있습니다)

```bash
source /opt/geant4/10.6.p02/bin/geant4.sh
```

다만, 이 명령어는 실행한 이후 해당 shell이 종료될 때까지만 그 효과가 지속됩니다. 즉, 터미널을 새로 연다거나 하면 다시 환경변수 설정이 사라지게 되죠.

그래서 일반적으로는 터미널을 켤 때마다 자동으로 한 번 실행되는 파일인 `~/.bashrc` 맨 밑에 위의 명령줄을 적어둡니다. vim이나 gedit 등을 이용하여 직접 입력하셔도 되고, 귀찮으시다면 다음 명령줄을 한 번 실행시키시면 알아서 `~/.bashrc` 파일 맨 밑에 해당 내용이 추가됩니다.

```bash
echo "source /opt/geant4/10.6.p02/bin/geant4.sh" >> ~/.bashrc
```

`~/.bashrc`에 추가된 내용을 새로고침하기 위해 다음 줄까지 실행하고 넘어가겠습니다.

```bash
source ~/.bashrc
```

드디어 Geant4 설치가 끝났습니다!



---



## 제대로 설치되었는지 확인하기

### 환경변수 확인

정상적으로 설치가 완료되고 `geant.sh` 파일이 제대로 실행되었다면, `G4...`와 같은 형태의 환경변수가 크로스섹션 데이터를 담은 경로를 가리키고 있어야 합니다.

다음 명령어를 통해 제대로 그 경로가 출력되는지 확인할 수 있습니다.

```bash
env | grep G4
```

{{< image src="G4env.png" width=100% >}}

### 예제 실행해보기

#### 예제코드 복사해오기

예제코드는 **소스 코드를 압축해제한 디렉토리 안**에 `example`이라는 디렉토리에 있습니다. 

우리의 경우에는 `/opt/geant4/10.6.p02/geant4.10.06.p02/example`이 되겠군요.

테스트를 위해 `basic/B1` 이라는 예제를 복사해오고, 복사해온 디렉토리 안으로 들어가봅시다.

```bash
cp -r /opt/geant4/10.6.p02/geant4.10.06.p02/example/basic/B1 .
cd B1
```

#### 예제코드 실행하기 (터미널 상에서 실행)

예제 코드 B1에는 다음과 같은 파일 및 디렉토리들이 있을 것입니다.

{{< image src="b1example.png" width=100% >}}

이 글에서는 코드를 살펴보지는 않고, 그냥 실행만 하겠습니다.

우선 빌드를 하기 위해 다음 명령어를 입력합니다.

```
cmake .
make -f Makefile
```

다음 그림과 같이 많은 줄이 출력된 뒤, `[100%] Built target exampleB1`까지 나오면 성공입니다.

{{< image src="cmake_make.png" width=100% >}}

이어서 실행을 해봅니다.

```bash
./exampleB1 run1.mac
```

다음 그림처럼 또 무언가 잔뜩 출력된 뒤, `RunManagerKernel is deleted. Good bye :)`가 출력되었다면 잘 실행된 것입니다.

{{< image src="exampleB1_runmac.png" width=100% >}}

#### 예제코드 실행하기 (GUI 띄우기)

Geant4 설치 시 Qt5와 OpenGL 설치도 함께 진행했으므로, 여러분의 우분투에 X window 관련 설정이 잘 되어있다면 다음 명령어로 GUI창도 띄워볼 수 있습니다.

```bash
./exampleB1
```

잘 실행되었다면 다음과 같은 창이 나타날 것입니다.

{{< image src="exampleB1_gui.png" width=100% >}}



여기까지 되셨다면 설치와 테스트까지 성공적으로 하신 것입니다! 고생하셨습니다.
