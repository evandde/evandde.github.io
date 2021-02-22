# Visual Studio Code에서 Python3의 venv 사용하기


VSCode에서 Python3의 기능 중 가상환경을 설정하는 venv를 사용하는 방법에 대해 알아봅니다.



<!--more-->



{{< admonition success >}}

여기서는 <b>VSCode에서의 python3 환경을 구축한 상태</b>라고 가정합니다. 이에 관한 내용은 [이 글]({{< ref "vscode-python" >}})을 참고하세요.

{{< /admonition >}}

---

## 가상환경 생성

다음 명령어를 통해 python3에서 제공하는 venv 기능을 사용할 수 있습니다.

```powershell
python -m venv ./venv
```



## VSCode에서의 설정

vscode를 실행하고, `.py` 확장자의 빈 파일을 한 개 생성합니다. 그러면, vscode에서 자동으로 python 파일임을 인식하여 **왼쪽 아래에 python 인터프리터가 연동되는 것을 확인할 수 있습니다**.

{{< image src="newfile.png" width=100% >}}

이 곳을 클릭하면 다음과 같이 연동할 python 인터프리터의 목록이 뜹니다.

다음 그림을 따라 우리가 만들어둔 `venv/Scripts/python.exe`를 인터프리터로 선택해주면 됩니다.

{{< image src="selectpython1.png" width=100% >}}

{{< image src="selectpython2.png" width=100% >}}

{{< image src="selectpython3.png" width=100% >}}

이 과정을 완료하면, `.vscode`라는 폴더가 생기게 되고 이 안에 settings.json이라는 파일이 자동 생성됩니다. 이 파일을 열어보면, python 인터프리터의 경로가 우리가 만든 venv의 것으로 설정되고 있음을 확인할 수 있습니다.

{{< image src="settings_json.png" width=100% >}}


