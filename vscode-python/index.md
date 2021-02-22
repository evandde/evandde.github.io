# Visual Studio Code에서 Python3 환경 설정하기




VSCode에서 Python3 언어를 사용하기 위해 실행/디버깅 등이 가능한 환경을 구축하는 방법에 대해 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 <b>VSCode 설치를 완료한 상태</b>라고 가정합니다. VSCode 설치 및 기본 세팅은 [이 글]({{< ref "vscode" >}})을 참고하세요.

{{< /admonition >}}

---

## 컴파일러/디버거 설치

VSCode는 Python3 언어용 인터프리터를 자체적으로 내장하고있지 않습니다. 때문에 Python3 언어를 VSCode에서 사용하려면, 인터프리터를 직접 설치하고 이를 연동해주는 작업이 필요합니다.

{{< admonition warning >}}

Extension을 설치한다고 해서 인터프리터가 설치되는 것은 아닙니다.

{{< /admonition >}}

### Windows를 이용하는 경우

Windows는 기본적으로 Python3 언어용 인터프리터를 제공하지 않습니다. 따라서, 우리가 직접 설치해주어야 합니다.

이는 chocolatey를 통해 쉽게 설치할 수 있습니다.

{{< admonition info >}}

Chocolatey는 Windows용 패키지 관리자입니다. 아직 사용 방법을 모르신다면, [이 글]({{< ref "chocolatey" >}})을 참고하세요.

{{< /admonition >}}

```powershell
choco install python -y
```

{{< image src="python.png" width=100% >}}

다음 명령어를 통해 설치가 잘 되었는지 확인해보세요.

```powershell
python --version
```

{{< admonition tip >}}

Chocolatey 특성 상, 설치한 직후에는 `python` 명령어를 인식하지 못할 수 있습니다.

PowerShell을 껐다 켜거나, `refreshenv` 명령어를 활용하세요.

{{< /admonition >}}

{{< image src="python_version_windows.png" width=80% >}}

---

## Extension 설치

이제 VSCode에서 extension을 설치할 차례입니다.

VSCode를 켜고 extension 탭으로 간 뒤 "**python**"를 검색하세요. 맨 위에 python extension이 뜰 것입니다. Install 버튼을 눌러 설치합니다.

{{< image src="extension_python.png" width=100% >}}



---

## 테스트

이제 제대로 설치가 되었는지 확인할 시간입니다.

### 코드 작성

Explorer 탭으로 이동하여 적당한 경로에 <b>main.py</b>라는 새 파일을 만들어주고 다음과 같이 작성하도록 하겠습니다.

```python
print("Hello, World!")
```

{{< image src="codewriting.png" width=100% >}}

### 실행

다음 그림과 같이 [Run]-[Run Without Debugging]을 눌러 실행하시면 됩니다. 

이후 아래쪽의 **TERMINAL** 탭을 확인하시면, 우리가 작성한대로 Hello, World!가 화면에 출력되는 것을 확인할 수 있습니다.

{{< image src="run1.png" width=100% >}}

{{< image src="run2.png" width=100% >}}

### 디버깅

다음 그림과 같이 진행하여 디버깅도 가능합니다.

{{< image src="debug1.png" width=100% >}}

{{< image src="debug2.png" width=100% >}}

{{< image src="debug3.png" width=100% >}}

{{< image src="debug4.png" width=100% >}}

{{< image src="debug5.png" width=100% >}}


