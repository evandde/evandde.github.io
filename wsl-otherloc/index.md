# WSL을 다른 경로에 설치하는 법


MS Store를 통해 WSL을 다운받아 설치하게 되면, WSL이 설치되는 경로는 `%LocalAppData%\Packages\[PackageName]` 폴더 하위로 고정됩니다. 이 글에서는 Windows Subsystem for Linux를 기본 설치경로가 아닌 다른 경로에 설치하는 방법에 대해 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 WSL 설치를 위한 **Windows 기능 켜기** 등의 설정이 완료된 상태라고 가정합니다. 이에 관한 전반적인 내용은 [이 글]({{< ref "wsl" >}})을 참고하세요.

{{< /admonition >}}





---



## TL;DR

1. [이 페이지](https://docs.microsoft.com/ko-kr/windows/wsl/install-manual?irgwc=1&OCID=AID2000142_aff_7593_1243925&tduid=(ir__tmctq6trigkfrhgekk0sohzx0m2xjpbvc3r3s12c00)(7593)(1243925)(je6NUbpObpQ-EBkcl.71_gDZ2KcRFsI7Jw)()&irclickid=_tmctq6trigkfrhgekk0sohzx0m2xjpbvc3r3s12c00#downloading-distros?ranMID=24542&ranEAID=je6NUbpObpQ&ranSiteID=je6NUbpObpQ-EBkcl.71_gDZ2KcRFsI7Jw&epi=je6NUbpObpQ-EBkcl.71_gDZ2KcRFsI7Jw)에서 원하는 배포판을 다운로드

2. 다음 명령어로 파일확장자 변경

   ```powershell
   Rename-Item XXXX.appx XXXX.zip
   ```

3. 다음 명령어로 압축 해제

   ```powershell
   Expand-Archive XXXX.zip
   ```

4. 압축 해제 후 생성된 폴더에 들어가서 배포판 실행



---



## 배포판 다운로드

[이 페이지](https://docs.microsoft.com/ko-kr/windows/wsl/install-manual?irgwc=1&OCID=AID2000142_aff_7593_1243925&tduid=(ir__tmctq6trigkfrhgekk0sohzx0m2xjpbvc3r3s12c00)(7593)(1243925)(je6NUbpObpQ-EBkcl.71_gDZ2KcRFsI7Jw)()&irclickid=_tmctq6trigkfrhgekk0sohzx0m2xjpbvc3r3s12c00#downloading-distros?ranMID=24542&ranEAID=je6NUbpObpQ&ranSiteID=je6NUbpObpQ-EBkcl.71_gDZ2KcRFsI7Jw&epi=je6NUbpObpQ-EBkcl.71_gDZ2KcRFsI7Jw)를 방문하여, 설치하고자 하는 배포판을 다운받습니다. 

원래 MS Store를 사용할 수 없을 때 이용하라고 만들어져 있는 페이지입니다만, 이 페이지를 이용하면 `.appx` 형식의 파일을 받을 수 있습니다.

WSL을 설치하고자 하는 경로에, 다운받은 `.appx`파일을 옮겨둡니다.



---



## 다운받은 Appx파일의 압축 해제

아래 그림과 같이 `.appx` 파일을 옮겨둔 폴더에서 <b>파일-Windows PowerShell 열기(<u>R</u>)-Windows PowerShell 열기(<u>R</u>)</b>를 통해 PowerShell을 실행합니다. (PowerShell을 실행하여 해당 경로로 들어오셔도 됩니다.)

{{< image src="open_powershell.png" width=100% >}}

이어서 `Rename-Item` 명령어를 통해 확장자를 zip파일로 바꾸고, `Expand-Archive` 명령어를 통해 압축을 풀 것입니다. 예를들어 Ubuntu 20.04 배포판을 받았다면, `Ubuntu_2004.2020.424.0_x64.appx` 파일이 다운받아질 것입니다(작성일 기준). 그렇다면 다음과 같이 명령어를 입력하면 됩니다.

```powershell {linenos=table}
## 받은 appx 파일을 Ubuntu2004.zip으로 이름 변경
Rename-Item Ubuntu_2004.2020.424.0_x64.appx Ubuntu2004.zip
## zip 파일의 압축을 해제
Expand-Archive Ubuntu2004.zip
```



---



## 배포판 실행하여 설치 마무리

압축을 해제하면 압축파일과 동일한 폴더가 생성됩니다. 그 폴더 안에 배포판의 실행파일이 있을 것입니다.

최초 실행 시에는 이 파일로 실행하셔야 합니다. 그러면 MS Store에서 설치하는 경우와 동일하게 자동으로 설치과정이 마무리되고 계정생성과정이 진행될 것입니다.

{{< admonition info >}}

이렇게 최초 실행 후 설치가 마무리된 뒤에는 MS Store로 설치한 WSL과 동일한 방법으로 사용/관리 할 수 있습니다.

{{< /admonition >}}

{{< image src="wsl_firstrun.png" width=100% >}}


