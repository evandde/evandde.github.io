# Geant4 설치 무작정 따라하기(초보자용)






이 글은 Geant4 초보자 혹은 Geant4를 처음 사용하시는 분들에게, <b>Windows 10을 사용하는 개인 컴퓨터 환경</b>에서 Geant4를 최대한 쉽게 설치하는 방법을 전달하기 위해 작성하였습니다. <b>(인터넷 연결 필요)</b>



<!--more-->



{{< admonition warning >}}

이 글에서 제시하는 방향보다, 각자에게 더 적합한 Geant4 설치 방향이 있을 수 있습니다. 

하지만, 이 글은 <b>배경지식 없이도 실무에 사용 가능한 수준으로 Geant4를 설치하는 것을 목적</b>으로 하기 때문에, 작업 난이도 측면에서 쉬운 방향을 택하였습니다.

묻지도 따지지도 않고 "**우선 Geant4라는걸 써봐야겠다**" 라는 분에게 권장합니다.

{{< /admonition >}}



---



## 작업 흐름 요약

1. Windows 10에서 지원하는 기능인 <b>Windows Subsystem for Linux(WSL)</b>을 활용하여 Windows 10 내에 <b>Ubuntu 20.04 LTS</b>를 설치합니다.
2. Ubuntu 20.04 LTS 운영체제가 송신하는 그래픽 화면을 Windows10에서 띄울 수 있도록 해주는 **Xming**을 설치합니다.
3. Geant4 설치를 위해 Ubuntu 20.04 LTS 내에 필요한 라이브러리들을 설치합니다.
4. Ubuntu 20.04 LTS에 Geant4를 설치합니다.
   - 크로스섹션 데이터는 설치과정에서 자동으로 다운되도록 할 예정이므로 인터넷 연결이 필요합니다.
   - CLHep이라는 외부 라이브러리를 연동할 수도 있습니다만, 이는 필수가 아니므로 따로 설치하지 않을 것입니다.
   - 그래픽정도는 보여야 기분이 좋으므로, 그래픽 라이브러리는 연동하여 설치하겠습니다.
5. Geant4 예제를 실행시켜, 잘 설치되었는지 확인합니다.



---



## Ubuntu 20.04 LTS 설치하기

### Windows 10의 OS 빌드 버전 확인하기

1. [WIN]+[R]로 실행창을 띄움.

2. `winver` **입력하고 실행**하여, OS 빌드가 16215보다 높은지 확인.

   {{< admonition failure >}}

   OS 빌드가 16215보다 낮으면, 윈도우즈 업데이트를 먼저 진행하세요.

   {{< /admonition >}}

   {{< image src="winver.png" width=70% >}}

   확인 후에는 창을 끄셔도 됩니다.

### WSL1 형태로 Ubuntu 20.04 LTS 설치하기

1. [WIN]+[R]로 실행창을 띄움.

2. `powershell` 입력하고, <b>[CTRL]+[SHIFT]+[ENTER]를 눌러서 실행</b>하여, 관리자 권한으로 PowerShell을 실행.

   {{< admonition note >}}

   [WIN]+[R]로 띄운 실행창에서 [CTRL]+[SHIFT]+[ENTER]로 실행하면 관리자 권한으로 해당 프로그램을 실행합니다.

   {{< /admonition >}}

3. 다음 명령어 입력.

   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all
   ```

   

4. 재부팅. (아마 자동으로 재부팅 요청이 뜰 것임)

5. Microsoft Store에서 <b>Ubuntu 20.04 LTS</b>를 검색하여 설치. (이 [링크](https://www.microsoft.com/store/productId/9N6SVWS3RX71)를 활용해도 됨)

6. 설치한 Ubuntu를 실행. (시작메뉴에서 찾을 수 있음)

   자동으로 추가적인 설치작업이 이루어진 뒤 계정 생성 과정이 진행 됨.

   {{< image src="wsl_firstrun.png" width=100% >}}

7. 원하는 계정명(ID)과 비밀번호(Password)를 입력.

<b>이로써 여러분은 Windows 10 안에서 Ubuntu 20.04 LTS라는 리눅스 운영체제를 사용할 수 있게 되었습니다.</b>



---



## Xming 설치

### 설치하기

1. [Xming 공식 홈페이지](http://www.straightrunning.com/XmingNotes/)에서 Xming 다운로드.

   {{< image src="xming_download.png" width=100% >}}

2. 다운받은 파일을 실행하여 Xming 설치. (**다음**만 누르면서 진행해도 괜찮음)

### 실행하기

- 설치를 마치면 기본값으로 Xming이 자동으로 실행 될 것입니다.

- 별도로 설치 옵션을 건드리지 않으셨다면, 시작메뉴에서 Xming을 찾을 수 있습니다.

- Xming이 켜져 있는지의 여부는, 작업표시줄 오른쪽의 트레이아이콘을 확인하시면 알 수 있습니다. 트레이아이콘 중 X모양의 아이콘이 있다면 켜져있는 것입니다. 

  {{< image src="xming_running.png" width=50% >}}

- 종료하고자 할 때에는, **트레이아이콘을 우클릭**하고 **Exit**를 눌러주시면 됩니다.



---



## Geant4를 위한 관련 라이브러리 설치

1. 앞서 설치한 Ubuntu를 실행.

2. 다음 명령어를 입력하여, Xming과의 연동을 위해 `DISPLAY` 환경변수 설정.

   ```bash
   echo "export DISPLAY=localhost:0" >> ~/.bashrc
   ```

3. 다음 명령어를 입력하여, `apt` 패키지 매니저 최신화

   ```bash
   sudo apt update -y && sudo apt upgrade -y && sudo apt autoremove -y
   ```

   {{< admonition note >}}

   `sudo` 명령어로 인해, 비밀번호를 입력하라는 문구가 뜰 수 있습니다.

   이는 리눅스에서의 관리자 권한을 사용하기 위해 확인하는 절차입니다.

   여러분이 만든 계정의 비밀번호를 입력해주시면 됩니다.

   {{< /admonition >}}

4. 다음 명령어를 입력하여, 관련 라이브러리 설치

   - C++ 컴파일러 및 표준 라이브러리, 헤더 (<font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - CMake (<font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - Expat (Linux, macOS에서 <font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - Qt5, X11 OpenGL 라이브러리 설치 (<font color='blue'>Geant4 설치 시 선택 라이브러리</font>. GUI 등 그래픽 기반 기능 사용에 필요)

   ```bash
   sudo apt install -y build-essential cmake libexpat1-dev qt5-default libxmu-dev
   ```

<br>

설치에 시간이 다소 소요될 수 있으니 잠시 쉬고 오셔도 됩니다.



---



## Geant4 설치

<b>명령어 부분만 순서대로 입력하시면 됩니다.</b>

1. Geant4 툴킷을 설치할 디렉토리 생성

   ```bash
   sudo mkdir -p /opt/geant4/10.7.p01
   ```

2. 1에서 생성한 디렉토리로 이동하여, Geant4 소스코드 다운로드 (소스코드 용량 약 40 MB)

   ```bash
   cd /opt/geant4/10.7.p01
   sudo wget http://geant4-data.web.cern.ch/geant4-data/releases/geant4.10.07.p01.tar.gz
   ```

3. 2에서 다운받은 압축파일을 압축해제

   ```bash
   sudo tar -xf geant4.10.07.p01.tar.gz
   ```

4. `build`라는 이름의 디렉토리를 만들고 안으로 이동

   ```bash
   sudo mkdir build
   cd build
   ```

5. 컴파일 수행 (`make` 명령은 인터넷 속도 및 cpu 성능에 따라 수 분~수 십분 소요될 수 있음)

   - `CMAKE_INSTALL_PREFIX`(설치경로): `/opt/geant4/10.7.p01`
   - `GEANT4_BUILD_MULTITHREADED`(multi-threading 사용 여부): ON
   - `GEANT4_INSTALL_DATA`(크로스섹션 데이터 자동설치 여부): ON (데이터 총 용량 약 900 MB)
   - `GEANT4_USE_OPENGL_X11`(X11 OpenGL 라이브러리 연동 여부): ON
   - `GEANT4_USE_QT`(QT 라이브러리 연동 여부): ON

   ```bash
   sudo cmake ../geant4.10.07.p01 -DCMAKE_INSTALL_PREFIX=/opt/geant4/10.7.p01 -DGEANT4_BUILD_MULTITHREADED=ON -DGEANT4_INSTALL_DATA=ON -DGEANT4_USE_OPENGL_X11=ON -DGEANT4_USE_QT=ON
   sudo make -j `grep -c processor /proc/cpuinfo`
   sudo make install
   ```

   <b>이 부분에서 꽤 오랜 시간이 소요됩니다. 잠시 쉬고 오세요.</b>

6. 환경변수 세팅을 위해 `~/.bashrc`에 내용 추가

   ```bash
   echo "source /opt/geant4/10.7.p01/bin/geant4.sh" >> ~/.bashrc
   ```



---



## Geant4 예제 실행해보기

1. 다음 명령어를 입력하여 예제파일 복사해오기

   ```bash
   cp -r /opt/geant4/10.7.p01/geant4.10.07.p01/examples/basic/B1 ~
   cd ~/B1
   ```

2. 다음 명령어를 입력하여 빌드하기

   ```bash
   mkdir build
   cd build
   cmake ..
   make
   ```

   다음 그림과 같이 많은 줄이 출력된 뒤, `[100%] Built target exampleB1`까지 나오면 성공입니다.

   {{< image src="cmake_make.png" width=100% >}}

3. 다음 명령어를 입력하여 실행해보기

   ```bash
   ./exampleB1 run1.mac
   ```

   다음 그림처럼 또 무언가 잔뜩 출력된 뒤, `RunManagerKernel is deleted. Good bye :)`가 출력되었다면 잘 실행된 것입니다.

   {{< image src="exampleB1_runmac.png" width=100% >}}

4. 다음 명령어를 입력하여 GUI 띄워보기

   {{< admonition warning >}}

   이 부분은 Xming이 실행된 상태에서만 가능합니다. 반드시 Xming이 실행되어 있는지 확인하세요.

   {{< /admonition >}}

   ```bash
   ./exampleB1
   ```

   잘 실행되었다면 다음과 같은 창이 나타날 것입니다.
   
   {{< image src="exampleB1_gui.png" width=100% >}}

여기까지 되셨다면 설치와 테스트까지 성공적으로 하신 것입니다! 고생하셨습니다.
