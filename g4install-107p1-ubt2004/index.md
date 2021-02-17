# Geant4 설치하기(10.7.p01, Ubuntu 2004 LTS)


이 글에서는 Linux계열 운영체제 중 하나인 **Ubuntu 20.04 LTS**에서 **Geant4 10.7 patch 01 버전**을 설치하는 방법에 대해 알아봅니다. 

<!--more-->

## 설치 정보 요약

**설치 환경**

- 운영체제: Ubuntu 20.04 LTS
- 인터넷 사용 가능.
- 관리자 권한 (`sudo`) 이용 가능.

**설치 대상**

- Geant4 10.7 patch 01 버전.
- CLHep 라이브러리 별도 설치하여 연동.
- Cross-section data 직접 다운로드하여 준비.
- Multi-threading 기능 활성화.
- UI 및 가시화 기능 활용을 위해 Qt5, X11 OpenGL 라이브러리 연동하여 설치.

**설치 경로**

- `/opt/clhep/2.4.4.0`
- 여러 버전의 CLHep를 설치할 경우를 고려하여, `/opt/clhep` 하위에 버전별로 디렉토리를 만들고 그 하위에 설치 진행.
- `/opt/geant4/10.7.p01`
- 여러 버전의 Geant4를 설치할 경우를 고려하여, `/opt/geant4` 하위에 버전별로 디렉토리를 만들고 그 하위에 설치 진행.


---



## TL;DR

### Geant4 관련 필수/선택 라이브러리 설치

1. `apt` 패키지 매니저 최신화

   ```bash
   sudo apt update -y && sudo apt upgrade -y && sudo apt autoremove -y
   ```

2. `apt`를 이용하여 다음 항목 설치

   - C++ 컴파일러 및 표준 라이브러리, 헤더 (<font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - CMake (<font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - Expat (Linux, macOS에서 <font color='red'>Geant4 설치 시 필수 라이브러리</font>)
   - Qt5, X11 OpenGL 라이브러리 설치 (<font color='blue'>Geant4 설치 시 선택 라이브러리</font>. GUI 등 그래픽 기반 기능 사용에 필요)

   ```bash
   sudo apt install -y build-essential cmake libexpat1-dev qt5-default libxmu-dev
   ```

### CLHep 설치

1. CLHep 라이브러리를 설치할 디렉토리 생성

   ```bash
   sudo mkdir -p /opt/clhep
   ```

2. 1에서 생성한 디렉토리로 이동하여, CLHep 소스코드 다운로드 (소스코드 용량 약 1.5 MB)

   ```bash
   cd /opt/clhep
   sudo wget https://proj-clhep.web.cern.ch/proj-clhep/dist1/clhep-2.4.4.0.tgz
   ```

3. 2에서 다운받은 압축파일을 압축해제

   ```bash
   sudo tar -xf clhep-2.4.4.0.tgz
   ```

4. 압축해제로 생성된 `2.4.4.0` 디렉토리로 이동한 뒤, `build`라는 이름의 디렉토리를 생성하고 그 안으로 이동

   ```bash
   cd 2.4.4.0
   sudo mkdir build
   cd build
   ```

5. 컴파일 수행 (`make` 명령은 인터넷 속도 및 cpu 성능에 따라 수 분가량 소요될 수 있음)

   {{< admonition info >}}

   ccmake를 이용하여 설정하는 방법은 본문을 참고하세요.

   {{< /admonition >}}

   - `CMAKE_INSTALL_PREFIX`(설치경로): `/opt/clhep/2.4.4.0`

   ```bash
   sudo cmake ../CLHEP -DCMAKE_INSTALL_PREFIX=/opt/clhep/2.4.4.0
   sudo make -j `grep -c processor /proc/cpuinfo` && sudo make install
   ```

### Cross-section data 준비

1. Geant4용 cross-section data를 넣을 디렉토리 생성

   ```bash
   sudo mkdir -p /opt/geant4/geant4data
   ```

2. 1에서 생성한 디렉토리로 이동하여, cross-section data 다운로드 (전체 데이터 용량 약 928 MB)

   ```bash
   cd /opt/geant4/geant4data
   sudo wget https://geant4-data.web.cern.ch/datasets/G4NDL.4.6.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4EMLOW.7.13.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4PhotonEvaporation.5.7.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4RadioactiveDecay.5.6.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4SAIDDATA.2.0.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4PARTICLEXS.3.1.1.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4ABLA.3.1.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4INCL.1.0.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4PII.1.3.tar.gz
   sudo wget https://geant4-data.web.cern.ch/datasets/G4ENSDFSTATE.2.3.tar.gz
   ```

3. 2에서 다운받은 압축파일을 압축해제하고, 압축파일을 삭제

   ```bash
   sudo find -name "*.gz" -exec tar -xf {} \;
   sudo rm -rf *.gz
   ```

### Geant4 설치

1. Geant4 툴킷을 설치할 디렉토리 생성

   ```bash
   sudo mkdir -p /opt/geant4/10.7.p01
   ```

2. 1에서 생성한 디렉토리로 이동하여, Geant4 소스코드 다운로드 (소스코드 용량 약 35 MB)

   ```bash
   cd /opt/geant4/10.7.p01
   sudo wget http://geant4-data.web.cern.ch/geant4-data/releases/geant4.10.07.p01.tar.gz
   ```

3. 2에서 다운받은 압축파일을 압축해제 후 디렉토리명을 `source`로 변경

   ```bash
   sudo tar -xf geant4.10.07.p01.tar.gz
   ```
   
4. `build`라는 이름의 디렉토리를 만들고 안으로 이동

   ```bash
   sudo mkdir build
   cd build
   ```

5. 컴파일 수행 (`make` 명령은 인터넷 속도 및 cpu 성능에 따라 수 분~수 십분 소요될 수 있음)

   {{< admonition info >}}

   ccmake를 이용하여 설정하는 방법은 본문을 참고하세요.

   {{< /admonition >}}

   - `CMAKE_INSTALL_PREFIX`(설치경로): `/opt/geant4/10.7.p01`
   - `GEANT4_BUILD_MULTITHREADED`(multi-threading 사용 여부): ON
   - `GEANT4_INSTALL_DATADIR`(크로스섹션 데이터 경로): `/opt/geant4/geant4data`
   - `GEANT4_USE_OPENGL_X11`(X11 OpenGL 라이브러리 연동 여부): ON
   - `GEANT4_USE_QT`(QT 라이브러리 연동 여부): ON
   - `GEANT4_USE_SYSTEM_CLHEP`(직접 설치한 CLHep 라이브러리 연동 여부): ON
   - `CLHEP_DIR`(CLHEP 경로): `/opt/clhep/2.4.4.0/lib/CLHEP-2.4.4.0`

   ```bash
   sudo cmake ../geant4.10.07.p01 -DCMAKE_INSTALL_PREFIX=/opt/geant4/10.7.p01 -DGEANT4_BUILD_MULTITHREADED=ON -DGEANT4_INSTALL_DATADIR=/opt/geant4/geant4data -DGEANT4_USE_OPENGL_X11=ON -DGEANT4_USE_QT=ON -DGEANT4_USE_SYSTEM_CLHEP=ON -DCLHEP_DIR=/opt/clhep/2.4.4.0/lib/CLHEP-2.4.4.0
   sudo make -j `grep -c processor /proc/cpuinfo` && sudo make install
   ```
   
6. 환경변수 세팅을 위해 `~/.bashrc`에 내용 추가

   ```bash
   echo "source /opt/geant4/10.7.p01/bin/geant4.sh" >> ~/.bashrc
   ```



---


## Prerequisite 설치

인터넷이 안된다거나, 관리자 권한을 사용할 수 없다거나, Ubuntu가 아니라면 이야기가 좀 달라지겠지만...

앞서 말한 5가지 준비물은 모두 Ubuntu에서 제공하는 패키지 관리자 `apt`를 통해 설치할 수 있습니다.

(RedHat 계열의 리눅스에서도 패키지 관리자 `yum`을 통해 유사한 명령어로 설치할 수 있습니다)

{{< admonition warning >}}

패키지 관리자를 사용하기 전에 최신화를 해주세요.

{{< /admonition >}}

{{< admonition danger >}}

본인이 **서버 등을 관리하는 사람**이라면, **최신화를 할 때 주의**하세요. 이런 경우에는 전체 패키지를 최신화하기보다는 **원하는 특정 패키지를 선별하여 최신화하기를 권장**합니다.

{{< /admonition >}}

### 패키지 매니저 최신화

```bash
sudo apt update -y && sudo apt upgrade -y && sudo apt autoremove -y
```

### C++ 컴파일러 및 표준 라이브러리, 헤더 설치 (GCC 등)

```bash
sudo apt install -y build-essential
```

### CMake 및 CCMake 설치

```bash
sudo apt install -y cmake cmake-curses-gui
```

### Expat 설치

```bash
sudo apt install -y libexpat1-dev
```

### Qt5 설치

```bash
sudo apt install -y qt5-default
```

### X11 OpenGL 설치

```bash
sudo apt install -y libxmu-dev
```

### CLHep 설치하기

이어서 CLHep을 설치합니다. CLHep 라이브러리의 경우에는, apt 레포지토리에 원하는 버전이 없는 경우가 대부분이므로 직접 소스코드를 컴파일하여 설치합니다.

Geant4 10.7 버전은 CLHep 2.4.4.0 버전을 요구합니다만, Geant4 버전이 바뀜에 따라 상응하는 CLHep 버전도 변경되므로 버전별 관리를 하는 것이 추후 심신이 편합니다. 따라서, 여기서는 `/opt/clhep/2.4.4.0`과 같이 버전별로 경로를 만들어 설치하도록 하겠습니다.

1. 우선 CLHep 라이브러리를 설치할 디렉토리 생성합니다. (`/opt`는 `sudo` 권한이 있어야 수정할 수 있음)

   ```bash
   sudo mkdir -p /opt/clhep
   ```

2. 1에서 생성한 디렉토리로 이동하여, CLHep 소스코드를 다운로드합니다. (소스코드 용량 약 1.5 MB)

   ```bash
   cd /opt/clhep
   sudo wget https://proj-clhep.web.cern.ch/proj-clhep/dist1/clhep-2.4.4.0.tgz
   ```

   {{< admonition info >}}

   `wget` 명령어를 사용하지 않고, [CLHep 다운로드 페이지](https://proj-clhep.web.cern.ch/proj-clhep/clhep23.html)에서 직접 받아서 옮겨오셔도 괜찮습니다.

   {{< /admonition >}}

   {{< admonition tip >}}

   본 글에서 다루는 2.4.4.0이 아닌 다른 버전을 설치하시는 경우에는, `wget` 링크를 바꿔주셔야 합니다. 일반적으로 맨 뒤의 버전부분만 수정하면 됩니다.

   {{< /admonition >}}

3. 2번 과정을 통해 받은 압축파일 `clhep-2.4.4.0.tgz`을 압축해제합니다.

   ```bash
   sudo tar -xf clhep-2.4.4.0.tgz
   ```

   `2.4.4.0` 디렉토리가 생성되며 압축이 해제됩니다.

4. 생성된 `2.4.4.0` 디렉토리로 이동합니다. 이어서, 빌드를 수행하며 생기는 부산물을 보관하기 위한 `build`라는 이름의 디렉토리를 생성하고 그 안으로 이동합니다.

   ```bash
   cd 2.4.4.0
   sudo mkdir build
   cd build
   ```

5. `ccmake` 명령어를 통해 Makefile 생성 작업을 진행합니다.

   {{< admonition info >}}

   ccmake란 cmake 작업에 요구되는 옵션을 UI형태로 보여주며 작업하게 해주는 프로그램입니다. 옵션명과 인자를 정확하게 알고있다면, `cmake` 명령어를 이용하여 한번에 진행할 수도 있습니다. 이 명령줄은 위의 [TL;DR](#tldr) 부분을 참고하세요.

   {{< /admonition >}}

   우선 ccmake를 실행하기 위해 다음 명령어를 입력합니다.

   ```
   sudo ccmake ../CLHEP
   ```

   다음과 같은 화면이 뜰 것입니다.

   {{< image src="clhep_ccmake_01.png" width=100% >}}

   맨 처음 ccmake 프로그램을 실행하면, 기존 작업내용이 없어서 **EMPTY CACHE**가 출력되고, 화면 아래에 보이는 바와 같이 키보드 [c]를 누르면 configure 작업이 수행되고, [q]를 누르면 종료되는 식입니다.

   <b>[c]</b>를 눌러 configure 작업을 수행합니다.

   이어서 다음의 화면이 뜰 것입니다.

   {{< image src="clhep_ccmake_02.png" width=100% >}}

   여기서 `CMAKE_INSTALL_PREFIX` 항목이 CLHep을 설치할 경로를 설정하는 인자입니다. 우리는 이 값을 `/opt/clhep/2.4.4.0`으로 변경하겠습니다.

   **위아래 화살표키로 항목 간 이동이 가능하며, 엔터를 한 번 누르면 수정 모드로 변경되고, 내용 입력 후 다시 엔터를 한 번 누르면 확정됩니다.**

   입력을 마친 뒤 [c] 키를 한번 더 누르면 다음과 같이 화면이 바뀝니다.

   {{< image src="clhep_ccmake_03.png" width=100% >}}

   새로 생긴 <b>[g]</b>를 눌러 Makefile을 생성합니다.

6. 이제 컴파일 및 설치작업을 진행합니다. 

   ```bash
   sudo make -j `grep -c processor /proc/cpuinfo` && sudo make install
   ```
   
{{< admonition tip >}}
   
`make` 명령어는 `-j <쓰레드 수>` 옵션을 주면, 여러 쓰레드를 동시에 이용하여 좀 더 빨리 설치됩니다.
   
{{< /admonition >}}
   
{{< admonition warning >}}
   
`make` 명령어에서 `-j` 옵션을 주고 돌릴 때, 메모리가 부족한데 쓰레드 수가 너무 과하게 잡히면 `cc1plus` 관련 에러가 발생할 수 있습니다. `-j` 옵션에 적절한 숫자는 <b>자신의 쓰레드 수 * 1.2</b> 입니다. 여기서는 사용자 컴퓨터의 쓰레드 수를 가져오는 명령어인 `grep -c processor /proc/cpuinfo`를 이용하여 자동으로 숫자가 입력되게 하였습니다.
   
{{< /admonition >}}
   
`make` 명령을 수행하면 퍼센트가 올라가며 컴파일이 수행될 것입니다. 이는 CPU 성능에 따라 수십 초 ~ 수 분 가량 소요될 수 있으니 잠시 휴식을 취하시면 됩니다.



---



## Cross-section data 준비하기

Geant4를 설치하려면 cross-section data가 필요합니다. 이를 준비하는 방법은 두 가지 있습니다.

1. 사용자가 직접 다운받아서 압축 풀어서 준비.
2. 설치 과정에서 자동으로 다운로드.

무엇을 택하든 크게 상관은 없습니다만, 여기서는 1번 방법에 해당하는 직접 준비를 해보겠습니다.

### Geant4 cross-section data 디렉토리 생성

Cross-section data가 저장될 디렉토리를 생성한 뒤 이동합니다.

```bash
sudo mkdir -p /opt/geant4/geant4data
cd /opt/geant4/geant4data
```

### Data 다운로드

Cross-section data를 다운로드합니다. (총 10가지. 전체 데이터 용량 약 928 MB)

```bash
sudo wget https://geant4-data.web.cern.ch/datasets/G4NDL.4.6.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4EMLOW.7.13.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4PhotonEvaporation.5.7.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4RadioactiveDecay.5.6.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4SAIDDATA.2.0.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4PARTICLEXS.3.1.1.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4ABLA.3.1.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4INCL.1.0.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4PII.1.3.tar.gz
sudo wget https://geant4-data.web.cern.ch/datasets/G4ENSDFSTATE.2.3.tar.gz
```

{{< admonition info >}}

`wget` 명령어를 사용하지 않고, [Geant4 다운로드 페이지](https://geant4.web.cern.ch/support/download)에서 직접 받아서 옮겨오셔도 괜찮습니다.

{{< /admonition >}}

위에 적힌 10가지 외에 G4RealSurface, G4TENDL, LEND 데이터가 있습니다만, 이는 필수가 아닌 옵션이므로 여기서는 생략하겠습니다.

### 압축 해제

10개의 파일을 하나하나 압축 해제하기 귀찮으므로, `find` 명령어를 활용하여 일괄 해제 하는 명령어를 적어드립니다.

이후 불필요한 압축파일(`*.gz`)은 삭제해도 괜찮습니다.

```bash
sudo find -name "*.gz" -exec tar -xf {} \;
sudo rm -rf *.gz
```



---



## Geant4 설치하기

이제 준비가 다 되었습니다. 이어서 Geant4를 설치해봅시다.

우리가 설치하고자 하는 경로는 `/opt/geant4/10.7.p01`입니다. 앞서 말씀드린 것처럼, 여러 버전의 Geant4를 설치할 경우를 고려하여 `/opt/geant4` 하위에 버전명에 해당하는 디렉토리를 두어 세분화한 것입니다.

### 설치를 위한 디렉토리 생성

우선 해당 디렉토리를 생성하기 위해 다음 명령어를 입력합니다. (`/opt`는 관리자 권한이 있어야 수정할 수 있음)

```bash
sudo mkdir -p /opt/geant4/10.7.p01
```

### Geant4 소스코드 다운로드

이어서, 해당 디렉토리로 이동한 뒤 Geant4 소스코드를 다운 받겠습니다.

```bash
cd /opt/geant4/10.7.p01
sudo wget http://geant4-data.web.cern.ch/geant4-data/releases/geant4.10.07.p01.tar.gz 
```

{{< admonition info >}}

`wget` 명령어를 사용하지 않고, [Geant4 다운로드 페이지](https://geant4.web.cern.ch/support/download)에서 직접 받아서 옮겨오셔도 괜찮습니다.

{{< /admonition >}}

{{< admonition tip >}}

본 글에서 다루는 10.7.p01와 다른 버전을 설치하시는 경우에는, `wget` 링크를 바꿔주셔야 합니다. 일반적으로 맨 뒤의 버전부분만 수정하면 됩니다.

{{< /admonition >}}

### 소스코드 압축 해제

위 과정을 통해 `geant4.10.07.p01.tar.gz`라는 압축파일을 다운받으셨을 것입니다.

다음 명령어를 통해 해당 파일의 압축을 해제합니다.

```bash
sudo tar -xf geant4.10.07.p01.tar.gz
```

`geant4.10.07.p01`라는 디렉토리가 생성되고 그 안에 압축이 풀리게 됩니다.

### 빌드를 위한 build 디렉토리 생성

빌드를 수행하면 CMake와 관련된 잡다한 부산물이 생성됩니다. 관리의 용이성을 위해, 별도의 `build`라는 디렉토리를 만들고 이 안에서 컴파일을 수행하겠습니다.

```bash
sudo mkdir build
cd build
```

### CMake 수행 (ccmake 활용)

`ccmake` 명령어를 통해 Makefile 생성 작업을 진행합니다.

{{< admonition info >}}

ccmake란 cmake 작업에 요구되는 옵션을 UI형태로 보여주며 작업하게 해주는 프로그램입니다. 옵션명과 인자를 정확하게 알고있다면, `cmake` 명령어를 이용하여 한번에 진행할 수도 있습니다. 이 명령줄은 위의 [TL;DR](#tldr) 부분을 참고하세요.

{{< /admonition >}}

우선 ccmake를 실행하기 위해 다음 명령어를 입력합니다.

```
sudo ccmake ../geant4.10.07.p01
```

다음과 같은 화면이 뜰 것입니다.

{{< image src="geant4_ccmake_01.png" width=100% >}}

CLHep때와 마찬가지 모습입니다. <b>[c]</b>를 눌러 configure 작업을 수행합니다.

이어서 다음의 화면이 뜰 것입니다.

{{< image src="geant4_ccmake_02.png" width=100% >}}

Geant4 설치를 위한 cross-section data가 어디있는지 못찾겠다는 문구입니다.

<b>[e]</b>를 눌러 설정화면으로 돌아옵니다.

{{< image src="geant4_ccmake_03.png" width=100% >}}

이 화면에서 우리는 Geant4 설치에 관한 여러가지 인자를 조정할 수 있습니다. 이 글에서는 앞서 설명했던 설치조건에 맞추어 다음 항목들을 변경할 것입니다. 그림의 빨간 체크표시 된 값들을 참고하세요.

- `CMAKE_INSTALL_PREFIX`(설치경로): `/opt/geant4/10.7.p01`
- `GEANT4_BUILD_MULTITHREADED`(multi-threading 사용 여부): ON
- `GEANT4_INSTALL_DATADIR`(크로스섹션 데이터 경로): `/opt/geant4/geant4data`
- `GEANT4_USE_OPENGL_X11`(X11 OpenGL 라이브러리 연동 여부): ON
- `GEANT4_USE_QT`(QT 라이브러리 연동 여부): ON
- `GEANT4_USE_SYSTEM_CLHEP`(직접 설치한 CLHep 라이브러리 연동 여부): ON

이후 <b>[c]</b>를 눌러 configure 작업을 수행합니다.

또 다른 에러가 뜰 것입니다. CLHep을 직접 설치한 것으로 연동하겠다고 하였는데, CLHep이 어디에 있는지 못찾겠다는 에러입니다.

{{< image src="geant4_ccmake_04.png" width=100% >}}

다음 그림과 같이 `CLHEP_DIR`을 변경해줍니다.

{{< image src="geant4_ccmake_05.png" width=100% >}}

- `CLHEP_DIR`(CLHEP 경로): `/opt/clhep/2.4.4.0/lib/CLHEP-2.4.4.0`

이제 다시 <b>[c]</b>를 눌러 configure 작업을 수행하면, 에러는 뜨지 않고 Qt5 관련 경로가 알아서 잡힌 모습이 뜨게 됩니다.

{{< image src="geant4_ccmake_06.png" width=100% >}}

마지막으로 한번 더 <b>[c]</b>를 눌러 configure 작업을 수행합니다. 이제 드디어 <b>[g]</b> 버튼이 나타났습니다.

<b>[g]</b>를 눌러 Makefile을 생성합니다.

{{< image src="geant4_ccmake_07.png" width=100% >}}

### 컴파일 및 설치작업

이제 컴파일 및 설치작업을 진행합니다. 

```bash
sudo make -j `grep -c processor /proc/cpuinfo` && sudo make install
```

{{< admonition tip >}}

`make` 명령어는 `-j <쓰레드 수>` 옵션을 주면, 여러 쓰레드를 동시에 이용하여 좀 더 빨리 설치됩니다.

{{< /admonition >}}

{{< admonition warning >}}

`make` 명령어에서 `-j` 옵션을 주고 돌릴 때, 메모리가 부족한데 쓰레드 수가 너무 과하게 잡히면 `cc1plus` 관련 에러가 발생할 수 있습니다. `-j` 옵션에 적절한 숫자는 <b>자신의 쓰레드 수 * 1.2</b> 입니다. 여기서는 사용자 컴퓨터의 쓰레드 수를 가져오는 명령어인 `grep -c processor /proc/cpuinfo`를 이용하여 자동으로 숫자가 입력되게 하였습니다.

{{< /admonition >}}

`make` 명령을 수행하면 퍼센트가 올라가며 컴파일이 수행될 것입니다. 이는 CPU 성능에 따라 수 분 ~ 수십 분 가량 소요될 수 있으니 푹 쉬고 오세요.

{{< image src="geant4_make_07.png" width=100% >}}



## 환경변수 설정

Geant4 툴킷을 설치하고나면 마지막으로 할 일이 있습니다. 바로 **환경변수를 설정**하는 것입니다.

Geant4 사용을 위해 컴퓨터에게 알려줘야 하는 초기값들이 몇 가지 있습니다만, 이를 정리하여 한 번에 자동으로 설정이 되게끔하는 파일을 Geant4에서 제공하고 있습니다.

설치경로의 내부에 있는 `bin/geant4.sh`라는 파일입니다. (C-shell을 이용하시는 분은 `bin/geant4.csh`를 이용합니다)

{{< admonition info >}}

Geant4가 여러 버전으로 설치되어 있는 경우, 원하는 버전의 `bin/geant4.sh`를 실행함으로써 해당 버전으로 동작하도록 설정할 수 있습니다.

{{< /admonition >}}

실행을 위해서는 다음 명령어를 입력합니다. (`source` 명령어 뒤에 오는 경로는 Geant4를 설치한 경로에 따라 바뀔 수 있습니다)

```bash
source /opt/geant4/10.7.p01/bin/geant4.sh
```

다만, 이 명령어는 실행한 이후 해당 shell이 종료될 때까지만 그 효과가 지속됩니다. 즉, 터미널을 새로 연다거나 하면 다시 환경변수 설정이 사라지게 되죠.

그래서 일반적으로는 터미널을 켤 때마다 자동으로 한 번 실행되는 파일인 `~/.bashrc` 맨 밑에 위의 명령줄을 적어둡니다. vim이나 gedit 등을 이용하여 직접 입력하셔도 되고, 다음 명령줄을 이용하여 `~/.bashrc` 파일 맨 밑에 해당 내용이 추가되도록 하셔도 됩니다.

```bash
echo "source /opt/geant4/10.7.p01/bin/geant4.sh" >> ~/.bashrc
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

예제코드는 **소스 코드를 압축해제한 디렉토리 안**에 `examples`이라는 디렉토리에 있습니다. 

우리의 경우에는 `/opt/geant4/10.7.p01/geant4.10.06.p02/examples`이 되겠군요.

테스트를 위해 `basic/B1` 이라는 예제를 복사해오고, 복사해온 디렉토리 안으로 들어가봅시다.

```bash
cp -r /opt/geant4/10.7.p01/geant4.10.07.p01/examples/basic/B1 .
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

## Reference

- [Geant4 Homepage](https://geant4.cern.ch/)
- Geant4 Toolkit [소스 코드](https://geant4.web.cern.ch/support/download)
- [GNU Compiler Collection](http://gcc.gnu.org/)(GCC)
- [CMake](https://cmake.org/)
- [Expat](https://libexpat.github.io/)
- [Qt5](https://www.qt.io/download-qt-for-application-development)
- [OpenGL](https://www.opengl.org/)
