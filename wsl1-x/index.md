# WSL1에서 X window를 세팅하는 법


이 글에서는 WSL1을 설치한 뒤 X window(GUI)를 사용하기 위한 세팅 방법을 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 <b>WSL1</b> 설치가 완료된 상태라고 가정합니다. 이에 관한 전반적인 내용은 [이 글]({{< ref "wsl" >}})을 참고하세요.

{{< /admonition >}}

WSL을 설치하더라도, GUI 기반의 프로그램을 실행하려면 X window에 관한 추가적인 설정이 필요합니다. 이 글에서는 **WSL1**에서 X window 사용을 위한 세팅 방법을 다룹니다.



---



## TL;DR

1. [Xming 공식 홈페이지](http://www.straightrunning.com/XmingNotes/)에서 Xming 다운로드

2. Xming 설치 (다음만 누르며 설치해도 괜찮음)

3. WSL1에서 다음 명령어 입력

   ```bash
   echo "export DISPLAY=localhost:0" >> ~/.bashrc
   ```



---



## X window, X server란

**X window**는 UNIX 내지 Linux 계열의 운영체제에서 사용되는 GUI 환경 구현을 위한 시스템입니다. **X11**이라고도 부르고, 줄여서 그냥 **X**라고 부르기도 합니다. X window의 동작 원리는 간단하게 말하면 서버-클라이언트 구조입니다. "**프로그램이 GUI 창을 띄워달라고 X server에 요청**"하면, "**X server가 요청을 처리하여 GUI 창을 띄우는 것**"이죠.

일반적으로 Linux 운영체제 내에서 X server 프로그램이 구동되도록 설정된 환경에서는 내부적으로 알아서 화면을 띄울 수 있습니다. 하지만, PuTTY[^1]나 WSL과 같이 Windows에서 터미널만 켜서 이용하는 경우에는, 프로그램의 X window 실행 요청을 Windows가 받아서 처리해야 하기 때문에, **Windows용 X server 프로그램**이 필요합니다. 대표적으로 **Xming**, **VcXsrv**, **X410** 등이 있습니다.

클라이언트가 보내는 X window 실행 요청은, Linux 상에서 `DISPLAY`라고 정의된 환경변수의 값으로 전송됩니다. 즉, X server를 사용하려면, X server 프로그램이 요청을 받을 수 있는 일종의 사서함 주소를 확보한 뒤, 이 값을 `DISPLAY`로 정의해주면 되는 것입니다.



---



## Xming 설치

이 글에서는 Xming이라는 프로그램을 이용할 것입니다.

[Xming 공식 홈페이지](http://www.straightrunning.com/XmingNotes/)에 들어가셔서 <u>Xming 설치파일을 받아오시기 바랍니다</u>. (버전이 높은 것은 Xming 측에 돈을 기부하고 계정을 받아야 사용가능하니, 그 밑에 있는 낮은 버전을 받으시면 됩니다.)

{{< image src="xming_download.png" width=100% >}}

설치는 그냥 다음 버튼만 누르며 하셔도 됩니다만, 나중의 편의를 위해 **단축아이콘 하나만 만들어두도록 합니다**. 아래 그림에 보이는 내용이 떴을 때 **Create a desktop icon for Xming에 체크**해주시면 됩니다.

{{< image src="xming_install.png" width=70% >}}

Xming이 켜져 있는지의 여부는, 작업표시줄 오른쪽의 트레이아이콘을 확인하시면 알 수 있습니다. 트레이아이콘 중 X모양의 아이콘이 있다면 켜져있는 것입니다. 종료하고자 할 때에는, **트레이아이콘을 우클릭**하고 **Exit**를 눌러주시면 됩니다.

{{< image src="xming_running.png" width=50% >}}



---



## WSL1과 Xming 연동

WSL1은 고민할 것이 별로 없습니다. WSL1은 Windows와 네트워크 상 주소가 동일하기 때문입니다. 클라이언트에서 X window 요청이 들어오면, 그대로 자기자신(localhost)에게 켜져 있는 Windows용 X server에 던져주면 끝입니다.

명령어 상으로는 다음과 같이 적어주면 됩니다.

```bash
export DISPLAY=localhost:0
```

다만, 이렇게 정의한 환경변수는 터미널이 종료되는 순간 사라집니다. 일반적으로는 매번 터미널이 켜질 때마다 저 명령줄이 자동으로 실행되도록 하기 위해, `~/.bashrc` 파일에 위의 내용을 적어두는 방식으로 활용합니다.

```bash
echo "export DISPLAY=localhost:0" >> ~/.bashrc
```



---



## GUI 연동 확인을 위한 테스트

이 모든 작업이 끝났다면, 아마 정상적으로 GUI가 실행될 것입니다.

GUI 창을 띄우는 프로그램을 사용하시는 게 있다면 그 프로그램으로 테스트 하시면 됩니다. 이 글에서는 xclock이라는 프로그램을 받아서 테스트하도록 하겠습니다.

```bash
## x11 어플리케이션 설치
sudo apt install x11-apps -y

## xclock 실행
xclock
```

{{< image src="xwindow_test_xclock.png" width=100% >}}



[^1]: [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/)는 무료 터미널 에뮬레이터로, 대개 서버용으로 활용되는 리눅스 운영체제 기반 컴퓨터에 원격접속하는 용도로 활용됩니다.


