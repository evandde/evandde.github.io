# WSL2에서 X window를 세팅하는 법


이 글에서는 WSL2를 설치한 뒤 X window(GUI)를 사용하기 위한 세팅 방법을 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 <b>WSL2</b> 설치가 완료된 상태라고 가정합니다. 이에 관한 전반적인 내용은 [이 글]({{< ref "wsl" >}})을 참고하세요.

{{< /admonition >}}

WSL을 설치하더라도, GUI 기반의 프로그램을 실행하려면 X window에 관한 추가적인 설정이 필요합니다. 이 글에서는 **WSL2**에서 X window 사용을 위한 세팅 방법을 다룹니다.



---



## TL;DR

1. [Xming 공식 홈페이지](http://www.straightrunning.com/XmingNotes/)에서 Xming 다운로드

2. Xming 설치 (다음만 누르며 설치해도 괜찮음)

3. Xming을 한 번 실행한 뒤 종료. (방화벽에 Xming 허용 규칙을 추가하기 위함)

4. Xming 단축아이콘을 만들고, <b>속성-대상</b> 항목의 맨 끝에 한 칸을 띄고 `-ac`를 이어서 적음
    {{< admonition warning >}}
    지우고 적는 것이 아니라, 맨 끝에 추가하는 것임에 주의하세요.
    {{< /admonition >}}
    {{< image src="xming_option_ac.png" width=50% >}}

5. Windows PowerShell을 <b>관리자 권한</b>으로 실행한 뒤, 다음 명령어 입력 (에러가 뜬다면 본문 참고)

   ```powershell
   Set-NetFirewallRule -DisplayName "Xming X Server" -Enabled True -Profile Any
   ```

6. WSL2에서 다음 명령어 입력

   ```bash
   echo 'export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '"'"'{print $2}'"'"'):0' >> ~/.bashrc
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

<i>(2021년 2월 17일 기준, 공식 홈페이지 접속이 안되네요. 구글에서 찾아서 다운받으세요.)</i>

{{< image src="xming_download.png" width=100% >}}

설치는 그냥 다음 버튼만 누르며 하셔도 됩니다만, 나중의 편의를 위해 **단축아이콘 하나만 만들어두도록 합니다**. 아래 그림에 보이는 내용이 떴을 때 **Create a desktop icon for Xming에 체크**해주시면 됩니다.

{{< image src="xming_install.png" width=70% >}}

Xming이 켜져 있는지의 여부는, 작업표시줄 오른쪽의 트레이아이콘을 확인하시면 알 수 있습니다. 트레이아이콘 중 X모양의 아이콘이 있다면 켜져있는 것입니다. 종료하고자 할 때에는, **트레이아이콘을 우클릭**하고 **Exit**를 눌러주시면 됩니다.

{{< image src="xming_running.png" width=50% >}}



---



## WSL2와 X server 연동의 어려움

WSL2에서 X server를 연동하는 경우는 WSL1에서와 사뭇 다릅니다. 

WSL1이 Windows와 동일한 네트워크를 사용했던 것과 달리, WSL2는 Windows 10 내에서 <u>별도의 WSL2 전용 네트워크를 사용</u>하고 있기 때문입니다. 

즉, WSL2와 Windows 10의 주소가 다르기 때문에, **WSL2에서 자기자신(localhost)에 X 요청을 보내게 되면 Window로 그 요청이 도달하지 못하는 것**이지요.

우리는 이 문제를 해결하기 위해 다음의 과정을 거쳐야 합니다.

1. Windows에서 실행한 X server 프로그램(Xming)에서 외부 IP로부터 들어오는 요청을 허용하도록 설정
2. Windows 방화벽에서 WSL2의 요청을 허용하도록 설정
3. WSL2에서 Windows의 주소를 획득하고, 이를 `DISPLAY` 환경변수로 지정



---



## WSL2와 Xming 연동

### Xming에서 외부 IP로부터의 요청을 허용하도록 설정

Xming은 기본적으로 자기자신(localhost)으로부터 들어온 요청만을 받아들이고, 외부 IP로부터의 요청은 받지 않도록 설정되어 있습니다. 그래서 Xming에서 설정을 바꿔주지 않으면, 아무리 WSL2에서 요청을 보내도 Xming이 받지 않는 것이지요.

이 부분을 허용하도록 설정하기 위해서는 Xming을 켤때 **-ac** 옵션을 넣어주면 됩니다.

1. **-ac** 옵션을 넣어 실행하기 위한 **Xming 단축아이콘 생성** (설치 시 바탕화면에 생성하였다면 이것을 이용해도 괜찮음)
2. 단축아이콘에서 **우클릭 - 속성**
3. **바로 가기** 탭 선택
4. **대상** 항목의 **맨 끝에 한 칸을 띄어쓴 뒤 -ac를 이어서 적음** 
{{< admonition warning >}}
지우고 적는 것이 아니라, 맨 끝에 추가하는 것임에 주의하세요.
{{< /admonition >}}
{{< image src="xming_option_ac.png" width=50% >}}

5. **확인**

이제 이 단축아이콘으로 Xming을 실행하게 되면, Xming이 -ac 옵션이 적용된 채로 켜지게 됩니다. 혹시 **현재 Xming이 켜져있다면 종료**하시고, **방금 설정한 단축아이콘으로 다시 실행**해주세요.



---



### Windows 방화벽에서 Xming으로 들어가는 요청 허용

WSL2에서 보내는 요청이 Xming에 도달하기 전에 **Windows 방화벽이 차단해버리는 경우**를 막기 위해, 다음의 작업을 통해 방화벽에서 Xming X Server로 들어가는 요청을 허용하도록 설정하시기 바랍니다.

{{< admonition warning >}}

이 작업을 수행하기 전에 반드시 한 번은 Xming을 실행한 적이 있어야 합니다. 최초실행 시 뜨는 경고창을 통해 방화벽에 Xming 허용 규칙을 추가하게 되기 때문입니다.

{{< /admonition >}}

1. [WIN]+[R]을 눌러 실행 창 띄우기

2. **powershell**을 입력한 뒤, [CTRL]+[SHIFT]+[ENTER]를 눌러서 PowerShell을 **관리자 권한**으로 실행

3. 다음 명령어 입력

   ```powershell
   Set-NetFirewallRule -DisplayName "Xming X Server" -Enabled True -Profile Any
   ```
   
   이 명령어를 입력할 때 다음과 같은 에러가 뜬다면, Xming을 실행한 적이 없기 때문입니다.
   
   {{< image src="firewall_error.png" width=100% >}}
   
   혹시 Xming을 실행한 적이 있음에도 이런 에러가 뜬다면, 다음 명령어를 입력하세요. (앞의 Set이 New로 바뀝니다)
   
   ```powershell
   New-NetFirewallRule -DisplayName "Xming X Server" -Enabled True -Profile Any
   ```



---



### Windows의 IP 주소 획득 및 DISPLAY 환경변수로 지정

WSL2에서 Windows의 IP 주소를 보는 것은 다음 명령어를 통해 가능합니다.

```bash
cat /etc/resolv.conf
```

{{< image src="wsl2_winIP.png" >}}

값을 확인했다면 이걸 이용해서 DISPLAY 환경변수의 값을 설정해주면 됩니다.

```bash
export DISPLAY=위에서_확인한_IP:0
```

이 작업 역시, 터미널을 종료하면 설정한 정보가 날아가버립니다. 때문에, <b>Windows의 IP 값을 받아다가 `DISPLAY` 변수를 정의하는 작업</b>을 한 문장으로 작성하여 `~/.bashrc`에 적어두는 방식을 사용합니다. 이 작업을 위해서는 `|`[^2], `grep`[^3], `awk`[^4]등 생소할 수도 있는 명령어가 사용됩니다만, 그대로 따라서 한 번만 실행시키시면 WSL2에서 작업할 내용은 끝나게 됩니다.

```bash
echo 'export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | awk '"'"'{print $2}'"'"'):0' >> ~/.bashrc
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
[^2]: `|`는 **pipe**라고 부르며, `|`의 앞에 있는 명령어의 실행 결과를 `|`의 뒤에 있는 명령어 실행의 입력인자로 활용하는 기호입니다.
[^3]: `grep`은 텍스트 검색에 관한 명령어입니다.
[^4]:  `awk`는 텍스트 형태의 데이터를 행과 단어 별로 처리하여 출력하는 데에 사용되는 명령어입니다.


