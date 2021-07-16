# Geant4 Windows 10에 설치 무작정 따라하기(초보자용)




이 글은 Geant4 초보자 혹은 Geant4를 처음 사용하시는 분들에게, <b>Windows 10을 사용하는 개인 컴퓨터 환경</b>에서 Geant4를 최대한 쉽게 설치하는 방법을 전달하기 위해 작성하였습니다. <b>(인터넷 연결 필요)</b>

<!--more-->

{{< admonition warning >}}

이 글에서 제시하는 방향보다, 각자에게 더 적합한 Geant4 설치 방향이 있을 수 있습니다. 

하지만, 이 글은 <b>배경지식 없이도 실무에 사용 가능한 수준으로 Geant4를 설치하는 것을 목적</b>으로 하기 때문에, 작업 난이도 측면에서 쉬운 방향을 택하였습니다.

묻지도 따지지도 않고 "**우선 Geant4라는걸 써봐야겠다**" 라는 분에게 권장합니다.

{{< /admonition >}}



---



## 작업 흐름 요약

1. Windows 10에 Microsoft Visual Studio 2019에 포함된 빌드 도구를 설치합니다.
2. Microsoft Visual Studio 2019 빌드 도구에 호환되는 Qt5 라이브러리를 설치합니다.
3. Windows 10에 Geant4를 설치합니다.
   - 크로스섹션 데이터는 설치과정에서 자동으로 다운되도록 할 예정이므로 인터넷 연결이 필요합니다.
   - CLHep은 내장된 사양만 사용하며, 따로 설치하지 않을 것입니다.
   - 그래픽 라이브러리로 Qt5를 연동하여 설치합니다.
4. Geant4 예제를 실행시켜, 잘 설치되었는지 확인합니다.



---



## VS2019 빌드 도구 설치

이 글에서는 Geant4 설치를 위한 빌드 도구로 gcc보다는 MSVC(Microsoft Visual C++)를 이용하여 진행할 예정입니다. 

{{< admonition note >}}

[공식 가이드](https://geant4-userdoc.web.cern.ch/UsersGuides/InstallationGuide/html/installguide.html#on-windows-platforms)에 따르면, Cygwin이나 MinGW도 테스트를 해보거나 직접적인 지원을 하는건 아니지만 Unix 플랫폼에서와 유사하게 진행하면 될 것이라고 합니다.

> Builds of Geant4 using Cygwin or MinGW with their own compilers or the Microsoft C++ Compiler are neither supported or tested, though the CMake system is expected to work under these toolchains. If you are using these tools via their native shells and with their own versions of CMake, then the instructions for building and installing on Unix platforms [On Unix Platforms](https://geant4-userdoc.web.cern.ch/UsersGuides/InstallationGuide/html/installguide.html#unixbuild) can be used.

제 경험상으로는 Linux/Unix 환경에서 gcc를 사용했던 경험에 비해 그리 시원치 않아서, 개인적으로 Windows 10에서 설치 시에는 MSVC를 추천합니다.

{{< /admonition >}}

### 다운로드

Microsoft에서 제공하는 Visual Studio 2019용 Build Tools는 [이 링크](https://visualstudio.microsoft.com/ko/downloads/#build-tools-for-visual-studio-2019)에서 무료로 받을 수 있습니다. 아래 그림에서 보이는 다운로드 링크를 누르면 됩니다.

{{< image src="vs2019buildtools_download.png" width=100% >}}

### 설치

다운받은 뒤 실행하면, 아래 그림과 같은 창이 뜰 것입니다. 이 중 <b>C++를 사용한 데스크톱 개발</b>을 클릭합니다. 오른쪽 설치 세부 정보에서, 자동으로 선택사항 중 일부가 선택될 것입니다. 혹시라도 <b>Windows용 C++ CMake 도구</b>가 선택이 안되어있다면, <b>꼭 선택</b>해주시기 바랍니다. 선택을 완료하셨다면 설치를 진행하시면 됩니다.

{{< image src="vs2019buildtools_install.png" width=100% >}}

### 설치여부 확인

제대로 설치가 되었는지 확인해보겠습니다. 

1. <b>[WIN]+[S]</b> 를 눌러 검색을 띄움

2. `developer powershell`을 입력하여 <b>Developer PowerShell for VS 2019</b>를 찾은 뒤 실행

   {{< image src="vs2019buildtools_test1.png" width=100% >}}

3. `cl`을 입력하여, 다음 그림과 같이 사용법(usage)이 뜨는지 확인

   {{< image src="vs2019buildtools_test2.png" width=100% >}}

4. 확인이 끝난 뒤에는, <b>Developer PowerShell을 일단 종료</b>(Qt 설치 시 충돌 방지)



---



## Qt5 라이브러리 설치

Qt는 Geant4에서 GUI를 띄우기 위해 필요한 라이브러리입니다. Qt는 라이센스 이슈 때문인지, 설치하려면 <b>Qt 계정 회원가입 및 로그인이 필요</b>합니다. 

{{< admonition note >}}

Qt는 무료로 이용하고자 할 경우,  [(L)GPL 라이센스 규약](https://www.qt.io/licensing/open-source-lgpl-obligations?hsLang=en)을 따를 것을 요구하니, 라이센스에 관한 정보가 필요하신 분은 참고하시기 바랍니다.

{{< /admonition >}}

### 다운로드

일단 [이 링크](https://www.qt.io/download)에서 Qt online installer를 다운받을 수 있습니다. 처음 들어오시면 헤매실까봐 눌러야하는 링크 순서를 보여드리니, 아래 그림을 참고해서 진행하시면 됩니다.

{{< image src="qt_download1.png" width=100% >}}

{{< image src="qt_download2.png" width=100% >}}

{{< image src="qt_download3.png" width=100% >}}

### 설치

설치파일을 다운받은 뒤 실행하시면, 다음과 같이 계정을 입력하라는 창이 뜹니다. 이미 가입하셨다면 Qt 계정을 입력하여 로그인하시고, 계정이 없으시다면 <u>Sign up</u>을 눌러 계정을 생성한 뒤 입력하시면 됩니다. 가입 시 이메일 인증절차가 필요합니다.

{{< image src="qt_install1.png" width=100% >}}

<br>

이어서 라이센스 동의 관련 내용이 뜹니다. 첫 번째 체크박스는 라이센스에 동의하겠다는 것이니 체크를 반드시 하셔야 합니다. 두 번째 네모상자 및 체크박스는 사용자가 기관인지 개인인지를 확인하는 란입니다. 기관이시면 기관명을 적고, 개인이시면 체크박스에 체크를 하면 됩니다.

{{< image src="qt_install2.png" width=100% >}}

<br>

Next 버튼을 누르다보면, Qt 발전을 위해 정보 제공 동의를 하는 내용이 나오는데, 이는 자유롭게 선택하시면 됩니다.

{{< image src="qt_install3.png" width=100% >}}

<br>

다음으로 설치경로 및 설치유형 선택이 나옵니다. 

일단, 이 글에서 설치 경로는 기본경로인 `C:\Qt`로 가겠습니다. 

설치 유형은 <b>Custom Installation</b>이 선택된대로 놔두시면 됩니다.

맨 아래의 <b>Associate common file types with Qt Creator.</b> 체크박스의 경우에는, 여러분이 Qt Creator라는 IDE를 사용하실 예정이라면 체크하시고, 사용할 계획이 없으시다면 체크를 해제하시면 됩니다.

{{< image src="qt_install4.png" width=100% >}}

<br>

Next를 누르면 설치할 항목을 고르는 부분이 나옵니다. **여기가 중요**합니다.

일단 <font color=red><b>Deselect All을 눌러 모든 항목을 선택 해제</b></font>합니다.

그리고나서, <font color=red><b>Qt > Qt 5.15.2 > MSVC 2019 64-bit만 선택</b></font>합니다.

{{< image src="qt_install5.png" width=100% >}}

{{< image src="qt_install6.png" width=100% >}}

{{< admonition note >}}

현재 Qt 최신버전은 6.x 버전입니다만, Geant4에서 아직 Qt5까지만 지원합니다.

그리고 Qt를 설치할 때 사용하는 컴파일러에 맞추어 설치해야 합니다. 저희는 MSVC를 이용하므로 이에 맞추어 설치를 진행합니다.

{{< /admonition >}}

이제 설치가 완료될 때까지 기다리시면 됩니다. Qt쪽 서버와 한국간 통신이 느려서 그런지 생각보다 오래 걸리더군요.

### 환경변수 설정

설치가 끝났다면 환경변수를 설정하는 과정이 필요합니다. `Path` 환경변수에 Qt가 설치된 경로의 bin 폴더를 추가해주어야 합니다.

{{< admonition warning >}}

기본경로인 `C:\Qt`가 아닌 다른 곳에 설치하셨다면, 맞추어 경로를 바꿔서 입력하셔야 합니다.

{{< /admonition >}}

PowerShell을 관리자 권한으로 열어, 명령어를 통해 설정하도록 하겠습니다.

1. <b>[WIN]+[R]</b>을 눌러 실행 창 열기

2. `powershell` 입력 후 <b>[CTRL]+[SHIFT]+[ENTER]</b>를 눌러 관리자 권한으로 powershell 실행

3. 다음 명령어 입력

   ```powershell
   [Environment]::SetEnvironmentVariable("Path", $env:Path+";C:\Qt\5.15.2\msvc2019_64\bin", "Machine")
   ```

### 설치여부 확인

방금 열어둔 PowerShell에서 `qmake`라고 입력한 뒤 사용법(usage)이 뜨는지 확인합니다.

{{< image src="qt_test.png" width=100% >}}



---

## Geant4 설치

### 다운로드

Geant4 소스코드는 [이 링크](https://geant4.web.cern.ch/support/download)에서 다운받을 수 있습니다. 위의 <b>Source files</b>라고 되어있는 항목 중 <b>ZIP format 파일</b>을 받으면 됩니다.

{{< image src="geant4_download.png" width=100% >}}



### 설치

이 글에서는 `C:\Geant4` 폴더를 만들어 여기에 설치를 하도록 하겠습니다. 경로는 자유롭게 하셔도 됩니다만, 추후 환경변수 등을 설정할 때 경로를 맞추어 변경해주셔야 하니 주의하시기 바랍니다.

이제 다음과 같이 순서대로 진행하시면 됩니다.

1. 위에서 다운받은 압축파일(geant4_10_07_p02.zip)을 `C:\Geant4` 폴더에 옮기고, 압축을 풀어줍니다.

   {{< image src="geant4_install1.png" width=100% >}}

2. 압축을 풀어 생긴 geant4_10_07_p02 폴더에 들어가서, <b>`build` 폴더와 `install` 폴더를 새로 만들어줍니다</b>.

   `build` 폴더는 cmake를 통해 생성되는 컴파일 결과가 보관될 폴더입니다.

   `install`폴더는 Geant4가 최종적으로 설치될 폴더입니다.

   {{< image src="geant4_install2.png" width=100% >}}

3. <b>Developer PowerShell for VS 2019</b>를 실행합니다.

   <b>[WIN]+[S]</b> 를 눌러 검색을 띄우고, `developer powershell`을 입력하여 <b>Developer PowerShell for VS 2019</b>를 찾은 뒤 실행하면 됩니다.

   {{< image src="vs2019buildtools_test1.png" width=100% >}}

4. PowerShell 상에서 `cd` 명령어를 이용하여, 앞서 만든 `build `폴더 위치로 이동합니다.

   예를 들어 이 글에서와 같이 `C:\Geant4\geant4_10_07_p02\build`로 이동해야 하는 경우에는, 다음과 같이 입력하면 됩니다.

   ```powershell
   cd C:\Geant4\geant4_10_07_p02\build
   ```

   {{< image src="geant4_install3.png" width=100% >}}

5. 다음 명령어를 그대로 입력하여 `cmake` 작업을 수행합니다. 오탈자 방지를 위해 복사-붙여넣기를 권장합니다.

   ```powershell
   cmake .. -DCMAKE_INSTALL_PREFIX="C:\Geant4\geant4_10_07_p02\install" -DGEANT4_BUILD_MULTITHREADED=ON -DGEANT4_INSTALL_DATA=ON -DGEANT4_BUILD_MSVC_MP=ON -DGEANT4_USE_QT=ON
   ```

   각 옵션의 의미는 다음과 같습니다.

   - CMAKE_INSTALL_PREFIX: Geant4가 설치될 폴더의 경로.
   - GEANT4_BUILD_MULTITHREADED: Geant4에서 MultiThreading이 가능하도록 설치할 지에 대한 여부. 기본값은 OFF.
   - GEANT4_INSTALL_DATA: Geant4 설치 시 크로스섹션 데이터를 자동으로 다운로드할 지에 대한 여부. 기본값은 OFF.
   - GEANT4_BUILD_MSVC_MP: Windows에서 MSVC 빌드 도구를 통해 설치할 때 Multiprocessing을 통해 설치 속도를 빠르게 할 지에 대한 여부. 기본값은 OFF.
   - GEANT4_USE_QT: Geant4에서 Qt5 기반의 GUI를 사용할 수 있도록 설치할 지에 대한 여부. 기본값은 OFF.

   다음 그림과 같이 <b>Configuring done</b>과 <b>Generating done</b> 문구를 확인하였다면 성공입니다.

   {{< image src="geant4_install4.png" width=100% >}}

6. 다음 명령어를 그대로 입력하여 빌드 및 설치 작업을 수행합니다. 오탈자 방지를 위해 복사-붙여넣기를 권장합니다.

   ```powershell
   cmake --build . --config Release --target install
   ```

   수행 중에 유니코드 이슈와 관련하여 warning C4819가 뜰 수 있습니다만, 무시하고 진행하셔도 괜찮습니다.

   최종적으로 아래 그림과 같이 `-- Installing: ...` 내역이 쭉 뜨고 끝나면 정상적으로 종료된 것입니다.

   {{< image src="geant4_install5.png" width=100% >}}

### 환경변수 설정

설치가 끝났다면 환경변수를 설정하는 과정이 필요합니다.

먼저, PowerShell을 관리자 권한으로 실행합니다. <font color=red><b>방금까지 Geant4 설치에 이용하던 Developer PowerShell for VS 2019에서 하는 것이 아님에 주의</b></font>하세요. 권한이 없어서 명령어가 제대로 실행되지 않을 수 있습니다.

1. <b>[WIN]+[R]</b>을 눌러 실행 창 열기

2. `powershell` 입력 후 <b>[CTRL]+[SHIFT]+[ENTER]</b>를 눌러 관리자 권한으로 powershell 실행

3. 다음 명령어 입력

   - `Path` 환경변수에 Geant4가 설치된 경로의 `bin` 폴더를 추가

     ```powershell
     [Environment]::SetEnvironmentVariable("Path", $env:Path+";C:\Geant4\geant4_10_07_p02\install\bin", "Machine")
     ```

   - `Geant4_DIR`이라는 환경변수를 만들어 Geant4가 설치된 경로의 `lib\Geant4-10.7.2` 폴더를 추가

     ```powershell
     [Environment]::SetEnvironmentVariable("Geant4_DIR", "C:\Geant4\geant4_10_07_p02\install\lib\Geant4-10.7.2", "Machine")
     ```

   - 크로스섹션 데이터 경로 설정을 위한 환경변수 설정 (참고: [Postinstall Setup — Geant4 Installation Guide 10.7 documentation (cern.ch)](https://geant4-userdoc.web.cern.ch/UsersGuides/InstallationGuide/html/postinstall.html#environment-variables-for-datasets))

     ```powershell
     [Environment]::SetEnvironmentVariable("G4ABLADATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4ABLA3.1", "Machine")
     [Environment]::SetEnvironmentVariable("G4ENSDFSTATEDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4ENSDFSTATE2.3", "Machine")
     [Environment]::SetEnvironmentVariable("G4INCLDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4INCL1.0", "Machine")
     [Environment]::SetEnvironmentVariable("G4LEDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4EMLOW7.13", "Machine")
     [Environment]::SetEnvironmentVariable("G4LEVELGAMMADATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\PhotonEvaporation5.7", "Machine")
     [Environment]::SetEnvironmentVariable("G4NEUTRONHPDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4NDL4.6", "Machine")
     [Environment]::SetEnvironmentVariable("G4PARTICLEXSDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4PARTICLEXS3.1.1", "Machine")
     [Environment]::SetEnvironmentVariable("G4PIIDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4PII1.3", "Machine")
     [Environment]::SetEnvironmentVariable("G4RADIOACTIVEDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\RadioactiveDecay5.6", "Machine")
     [Environment]::SetEnvironmentVariable("G4REALSURFACEDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\RealSurface2.2", "Machine")
     [Environment]::SetEnvironmentVariable("G4SAIDXSDATA", "C:\Geant4\geant4_10_07_p02\install\share\Geant4-10.7.2\data\G4SAIDDATA2.0", "Machine")
     ```

---

## Geant4 예제 실행해보기

Geant4 설치를 완료했으니 이제 실행을 해봐야겠죠.

Windows에서 Geant4 라이브러리 기반의 코드를 빌드하려면 <b><font color=red>Developer PowerShell for VS 2019를 통해 진행</font></b>하셔야 합니다. 

예제파일은 소스코드의 압축을 풀었던 곳에 있는 `examples` 폴더에 있습니다. 여기서는 제일 기본예제인 `examples\basic\B1`을 테스트 해보겠습니다.

1. `B1` 폴더를 <b>폴더 째로 복사</b>하여 원하는 곳에 가져옵니다. 저는 `C:\Geant4\B1`으로 복사해왔습니다.

2. 복사해온 `B1` 폴더 안에 <b>`build`라는 폴더를 새로 만듭니다</b>.

   {{< image src="example1.png" width=100% >}}

3. 복사해온 B1 폴더 안에 있는 `CMakeLists.txt` 파일을 열어, 파일의 맨 위에 다음 내용을 추가합니다.

   ```cmake
   #----------------------------------------------------------------------------
   # Set build output directory to be ./build 
   # rather than ./build/Release or ./build/RelWithDebInfo
   set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE "${CMAKE_BINARY_DIR}")
   set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELWITHDEBINFO "${CMAKE_BINARY_DIR}")
   ```

   {{< image src="example2.png" width=100% >}}

   {{< admonition note>}}

   Geant4 코드는 init_vis.mac, vis.mac,...과 같은 *.mac 파일을 불러와서 이를 연동하여 실행하는 경우가 많습니다.

   일반적으로 UNIX/LINUX 환경에서는 실행파일과 *.mac 파일이 동일한 경로에 존재하도록 빌드를 수행하기 때문에, 대부분의 Geant4 코드는 이들의 위치가 동일하게 `build` 폴더에 있으리라는 가정 하에 작성되어 있습니다. 그러나 MSVC를 이용하여 빌드를 수행할 경우에는, *.mac 파일은 `build` 폴더에 있지만, 실행파일(\*.exe)은 `build\Release`나 `build\RelWithDebInfo` 폴더 안에 생성됩니다.

   위의 코드를 `CMakeLists.txt`에 추가하면, 실행파일이 *.mac 파일의 위치와 동일한 `build` 폴더에 생성되어 이 문제를 해결할 수 있습니다.

   {{< /admonition >}}

4. Developer PowerShell for VS 2019를 실행합니다. (앞서 켜둔 것이 있다면 그대로 쓰시면 됩니다)

   <b>[WIN]+[S]</b> 를 눌러 검색을 띄우고, `developer powershell`을 입력하여 <b>Developer PowerShell for VS 2019</b>를 찾은 뒤 실행하면 됩니다.

5. `cd` 명령어를 이용하여, 예제 코드를 복사해온 경로의 `build` 폴더로 이동합니다. 이 글에서처럼 `C:\Geant4\B1`으로 복사하였다면 다음과 같이 입력하면 됩니다.

   ```powershell
   cd C:\Geant4\B1\build
   ```

6. 다음 명령어를 입력하여 빌드를 수행합니다.

   ```powershell
   cmake ..
   cmake --build . --config Release
   ```

   {{< image src="example3.png" width=100% >}}

7. 명령줄에 `./exampleB1.exe`를 입력하여 실행하거나, `build` 폴더 안에 있는 `exampleB1.exe`파일을 더블클릭하여 실행합니다.

   다음과 같은 GUI 창이 뜨면 성공입니다.

   {{< image src="example4.png" width=100% >}}


