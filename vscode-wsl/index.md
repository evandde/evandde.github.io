# Visual Studio Code와 Windows Subsystem for Linux 연동하기


VSCode와 WSL을 연동하여 사용하는 방법에 대해 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 <b>WSL1 혹은 WSL2</b> 설치가 완료된 상태라고 가정합니다. 이에 관한 전반적인 내용은 [이 글]({{< ref "wsl" >}})을 참고하세요.

{{< /admonition >}}

{{< admonition success >}}

여기서는 <b>VSCode</b> 설치가 완료된 상태라고 가정합니다. VSCode 설치 및 기본 세팅은 [이 글]({{< ref "vscode" >}})을 참고하세요.

{{< /admonition >}}

---

## Remote WSL 확장 설치

{{< admonition info >}}

Remote WSL 확장을 설치하기 위해서는, <b>1.35 버전 이상</b>의 VSCode가 필요합니다.

{{< /admonition >}}

VSCode를 켜고 extension 탭으로 간 뒤 "**wsl**"를 검색하세요. 맨 위에 Remote - WSL extension이 뜰 것입니다. Install 버튼을 눌러 설치합니다.

{{< image src="extension_wsl.png" width=100% >}}

---

## Linux 배포판 최신화 및 라이브러리 설치

일부 WSL 배포판의 경우에는 VSCode를 실행하기 위한 라이브러리가 없을 수 있습니다.

이 경우에는 패키지매니저(apt, yum)를 최신화하고, 필요한 라이브러리를 설치하시기 바랍니다.

>  Debian이나 Ubuntu의 경우 apt를 활용한 예
>
> ```bash
> sudo apt update -y && sudo apt upgrade -y
> ```

wget[^1]이나 ca 인증서[^2]를 다운받아야 할 수 있습니다.

>  Debian이나 Ubuntu의 경우 apt를 활용한 예
>
> ```bash
> sudo apt install wget -y
> sudo apt install ca-certificates -y
> ```

---

## 실행해보기

### WSL 터미널에서 실행

원하는 프로젝트의 디렉토리에서, `code .` 명령어를 입력합니다.

첫 실행 시에는 자동으로 설치가 진행된 뒤 VSCode가 실행됩니다.

실행한 뒤, 창 왼쪽 아래의 초록색 부분에 <b>WSL: [배포판 이름]</b>이 정상적으로 뜬다면 성공입니다.

{{< image src="wsl-open-vs-code.gif" width=100% caption="Ref.: [Get started using VS Code with Windows Subsystem for Linux | Microsoft Docs](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode)" >}}

### VSCode에서 실행

다음 그림과 같이 진행합니다.

{{< image src="vscode_open_remotewsl1.png" width=100% >}}

{{< image src="vscode_open_remotewsl2.png" width=100% >}}

{{< image src="vscode_open_remotewsl3.png" width=100% >}}

---

## WSL에 확장 설치하기

Extension 탭을 열면 위쪽에는 Local(윈도우)에 설치된 확장 목록이, 아래쪽에는 WSL에 설치된 확장 목록이 뜹니다.

이미 로컬에 설치된 확장을 설치할 수도 있고, WSL에만 확장을 설치할 수도 있습니다.

다음 그림을 참고하세요.

{{< image src="extension_copy1.png" width=100% >}}

{{< image src="extension_copy2.png" width=100% >}}

{{< image src="extension_copy3.png" width=100% >}}

{{< image src="extension_copy4.png" width=100% >}}

{{< image src="extension_copy5.png" width=100% >}}



[^1]: 웹 서버로부터 데이터를 다운 받기 위한 명령어
[^2]: SSL 기반의 응용프로그램이 SSL 연결의 신뢰성을 검사할 수 있도록 허용하기 위한 인증서
