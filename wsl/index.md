# Linux용 Windows Subsystem(WSL1, WSL2)


Windows Subsystem for Linux, 약칭 WSL을 설치하고 이용하는 법을 알아봅니다. 이 글은 WSL1과 WSL2을 둘 다 다룹니다.
<!--more-->

<b>Linux용 Windows 하위 시스템(Windows Subsystem for Linux, WSL)</b>은 가상머신을 이용함에 따른 추가적인 메모리/CPU 소모나 듀얼부팅 설정 등을 요구하지 않으면서도, Windows 운영체제 하에서 Linux 기반의 대부분의 명령줄 도구, 유틸리티, 애플리케이션 등을 사용할 수 있게 해주는 서비스입니다.

간단하게 말하면, Windows에서 Linux의 bash shell을 켤 수 있고, Linux 전용의 프로그램을 자유롭게 실행할 수 있게 된다는 뜻입니다. 그것도 별도의 가상머신 프로그램 없이 말이죠.

이 글에서는 두 가지 WSL 버전인 WSL1과 WSL2의 차이를 살펴보고, 이를 설치하고 이용하는 방법에 대해 알아봅니다.



---



## TL;DR

1. PowerShell을 **관리자 권한**으로 실행한 뒤, Linux용 Windows 하위시스템 옵션을 사용하기 위해 다음 명령어 입력

   ```powershell
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   ```

3. (**WSL1 설치 시에는 이 과정 스킵**) PowerShell을 **관리자 권한**으로 실행한 뒤, Virtual Machine 플랫폼 옵션을 사용하기 위해 다음 명령어 입력 

   ```powershell
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

4. **재부팅**
   
4. (**WSL1 설치 시에는 이 과정 스킵**) 본인의 아키텍쳐에 맞추어 Linux 커널 업데이트 패키지를 다운로드 후 설치

   x64용 다운로드 링크: https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

   ARM64용 다운로드 링크: https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_arm64.msi

5. (**WSL1 설치 시에는 이 과정 스킵**) **재부팅**

6. (**WSL1 설치 시에는 이 과정 스킵**) PowerShell을 **관리자 권한**으로 실행한 뒤, WSL2를 기본 버전으로 설정하기 위해 다음 명령어 입력

   ```powershell
   wsl --set-default-version 2
   ```

7. [Microsoft Store](https://aka.ms/wslstore)에서 WSL 검색 후, 원하는 Linux 배포 설치



---



## WSL1 vs. WSL2

{{< image src="wsl1vswsl2.png" >}}

위의 비교 표에서 알 수 있듯, WSL2가 WSL1에 비해 대개 우수한 성능을 보입니다.

다만, OS 파일시스템 간 성능 측면에서는 WSL1이 우수합니다.

### OS 파일시스템 간 성능이란

WSL 파일시스템과 Windows 파일시스템의 위치는 서로 다릅니다. 성능을 고려할 때 **WSL에서 접근하는 파일**은 **되도록 WSL 파일시스템의 하위경로에 두고 사용할 것을 권장**합니다.

- (**이런 곳에 저장하세요**) Linux 파일 시스템: `\\wsl$\<distro>\home\<username>\`
- (**이런 곳 말구요**) Windows 파일 시스템: `C:\Users\<username>\`

<u>다만, WSL에서도 Windows 파일시스템에 존재하는 파일에 접근할 수 있으며, 그 반대 또한 가능합니다. 이런 식의 접근이 불가피하고 잦은 경우에는, WSL1을 이용하는 것이 더 나을 수 있습니다.</u>



---



## 최소 요구사양

- 운영체제: Windows 10 혹은 Windows server 2019
- 아키텍쳐[^1]: 64 bit
- 빌드 버전[^2]
  - WSL1을 설치하는 경우: Build 16215 이상
  - WSL2를 설치하는 경우: Build 19041 이상



---



## WSL1 설치하기

**1. Linux용 Windows 하위 시스템 사용**

PowerShell을 **관리자 권한**으로 실행하고, 다음 명령어를 입력합니다.

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

**2. 재부팅**

**3. 원하는 Linux 배포를 다운로드하여 설치**

[Microsoft Store](https://aka.ms/wslstore)에서 WSL을 검색하고, 원하는 배포판을 설치하면 됩니다.

{{< admonition info >}}

MS Store에서 설치 시, 설치되는 경로는 `%LocalAppData%\Packages\[PackageName]` 폴더 하위로 고정됩니다. 만약 별도로 원하는 경로에 설치하고자 하는 경우에는 [이 글]({{< ref "" >}})을 참고하세요. 

{{< /admonition >}}

{{< image src="msstore_wsl.png" width=100% >}}



---



## WSL2 설치하기

**1. Linux용 Windows 하위 시스템 사용**

PowerShell을 **관리자 권한**으로 실행하고, 다음 명령어를 입력합니다.

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

**2. Virtual Machine 플랫폼 사용**

PowerShell을 **관리자 권한**으로 실행하고, 다음 명령어를 입력합니다.

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**3. 재부팅**

**4. Linux 커널 업데이트 패키지 설치**

[이 페이지](https://docs.microsoft.com/ko-kr/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package)를 방문하여 본인 시스템의 아키텍쳐에 맞는 Linux 커널 업데이트 패키지를 다운받습니다. 해당 페이지에 있는 링크를 그대로 아래에 복사해두었으니 아래를 이용하셔도 됩니다.

- x64용 다운로드 링크: https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

- ARM64용 다운로드 링크: https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_arm64.msi

.msi 파일을 다운받으셨다면, 실행하여 설치를 진행합니다.

**5. 재부팅**

**6. WSL2를 WSL의 기본버전으로 설정**

PowerShell을 **관리자 권한**으로 열어 실행하고, 다음 명령어를 입력합니다.

```powershell
wsl --set-default-version 2
```

**7. 원하는 Linux 배포를 다운로드하여 설치**

[Microsoft Store](https://aka.ms/wslstore)에서 WSL을 검색하고, 원하는 배포판을 설치하면 됩니다.

{{< admonition info >}}

MS Store에서 설치 시, 설치되는 경로는 `%LocalAppData%\Packages\[PackageName]` 폴더 하위로 고정됩니다. 만약 별도로 원하는 경로에 설치하고자 하는 경우에는 [이 글]({{< ref "" >}})을 참고하세요. 

{{< /admonition >}}



---



## 설치한 배포판 실행

Microsoft Store를 통해 설치하면, 시작메뉴에 설치한 리눅스 배포판이 뜰 것입니다. 이를 처음 실행하면 추가적인 설치 마무리 작업을 수행한 뒤, 그 후 계정 생성 과정이 진행됩니다.

{{< image src="wsl_firstrun.png" width=100% >}}

여기서 원하는 계정명과 비밀번호를 입력하여 계정생성을 하면 설치가 완료됩니다.

이후에는, 아까와 같이 시작메뉴에서 배포판을 실행하거나, cmd/powershell/실행윈도우([WIN]+[R])에서 `wsl`을 입력하여 실행할 수 있습니다.



---



## 배포판의 관리

{{< admonition info >}}

하나의 Windows 운영체제에 여러 개의 WSL을 설치할 수 있습니다. 또한, 각 WSL마다 버전을 달리하여, 어떤 것은 WSL1로, 어떤 것은 WSL2로 이용할 수도 있습니다.

{{< /admonition >}}

PowerShell에서 `wsl` 명령어 뒤에 다양한 옵션을 입력하여, 설치한 wsl 배포판에 대한 다양한 설정을 할 수 있습니다.

사용 가능한 명령어의 설명은 다음 명령어로 확인 가능합니다.

```powershell
wsl --help
```

### 설치된 배포판 목록 확인

현재 설치된 배포판을 확인하려면 다음 명령어를 입력합니다.

```powershell
wsl -l
```

이 때, `-v` 옵션을 더 추가하면, 각 배포판의 현재 상태와 더불어 WSL1/WSL2 중 어떤 버전인지에 대한 정보까지 출력할 수 있습니다.

```powershell
wsl -l -v
```

{{< image src="wsl_list.png" width=50% >}}

NAME 옆의 * 표시는 `wsl` 이라는 명령어만 입력하였을때 실행되는 기본 wsl 배포판이 무엇인지 알려주는 표시입니다.

### 기본 실행 배포판 변경

앞서 `wsl -l` 명령어로 확인한 배포판의 이름(예: `Ubuntu-20.04`)을 확인한 뒤, `-s <Distro>` 옵션을 이용합니다.

예를 들어 기본 실행 배포판을 Ubuntu-20.04로 변경하는 경우에는 다음과 같이 입력합니다.

```powershell
wsl -s Ubuntu-20.04
```

### 설치된 배포판의 버전 변경(WSL1/WSL2)

앞서 `wsl -l` 명령어로 확인한 배포판의 이름(예: `Ubuntu-20.04`)을 확인한 뒤, `--set-version <Distro> <버전>` 옵션을 이용합니다.

{{< admonition note >}}

WSL1에서 WSL2로 올리는 것도 되고, 반대로 WSL2에서 WSL1로 내리는 것도 가능합니다.

{{< /admonition >}}

예를 들어 Ubuntu-20.04 배포판을 WSL2로 변경하는 경우에는 다음과 같이 입력합니다.

```powershell
wsl --set-version Ubuntu-20.04 2
```

수 분 정도 소요될 수 있습니다. 기다리면 배포판의 버전이 자동으로 변경됩니다.

### 설치된 배포판의 제거

앞서 `wsl -l` 명령어로 확인한 배포판의 이름(예: `Ubuntu-20.04`)을 확인한 뒤, `--unregister <Distro>` 옵션을 이용합니다.

예를 들어 Ubuntu-20.04 배포판을 제거하는 경우에는 다음과 같이 입력합니다.

```powershell
wsl --unregister Ubuntu-20.04
```

이 후에, MS store에서 설치한 내역을 찾아 uninstall까지 해주면 완전히 제거됩니다.



---



## WSL에서 Windows 파일시스템 접근

Windows의 디스크 드라이브는 WSL에서 `/mnt/c`, `/mnt/d`... 등으로 마운트되어 있습니다. 사용자가 별도로 마운트하지 않아도 바로 접근이 가능합니다.

{{< admonition failure >}}

USB나 media drive 등 이동식 디스크에 대해서는 마운트 방법이 지원되지 않고 있습니다.

{{< /admonition >}}



---



## Windows에서 WSL 파일시스템 접근

`\\wsl$\<Distro>\` 경로를 갖는 네트워크 드라이브로 접근할 수 있습니다. 예를 들어 Ubuntu-20.04 배포판의 파일시스템은 `\\wsl$\Ubuntu-20.04\`로 접근할 수 있습니다.

{{< admonition note >}}

만약 탐색기에서 `\\wsl$\`에 접근 시 하위 목록이 보이지 않는다면, 한 번도 해당 인스턴스가 기동되지 않았기 때문입니다. 경로 입력란에 `\\wsl$\<Distro>`를 입력하여 한 번 들어가고 난 뒤부터는 표시가 될 것입니다.

{{< /admonition >}}



---



## Reference

https://docs.microsoft.com/en-us/windows/wsl/

https://cloudlinuxtech.com/install-linux-on-windows-10-wsl/#Prerequisite_to_install_WSL1_or_WSL2




[^1]: [WIN]+[R]로 실행 창을 연 뒤, `msinfo32`를 입력하여 시스템 정보 창을 띄우고, **시스템 종류**를 확인합니다.
[^2]: [WIN]+[R]로 실행 창을 연 뒤, `msinfo32`를 입력하여 시스템 정보 창을 띄우고, **버전**을 확인합니다.
