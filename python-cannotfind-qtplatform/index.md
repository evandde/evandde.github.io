# qt.qpa.plugin 오류 해결


Python에서 PyQt5 라이브러리를 연동하여 GUI 프로그래밍을 할 때 발생한 "<b>qt.qpa.plugin: Could not find the Qt platform plugin "windows" in "".</b>" 과 같은 오류를 해결하는 방법에 대해 알아봅니다.

<!--more-->

{{< image src="error.png" width=100% >}}

{{< admonition warning >}}

이 글에서는 `pip install pyqt5 pyqt5-tools` 등의 과정을 통해 pyqt5는 이미 설치한 상태라고 가정합니다.

{{< /admonition >}}

---



## TL;DR

1. python 실행

2. 다음 명령줄 입력하여 python이 설치된 경로 확인 (venv로 실행 중이라면 venv 경로로 뜰 것임)

   ```python
   import sys
   sys.executable
   ```

3. 뜨는 경로 중 **시작부터 Scripts 이전까지**를 복사

   {{< image src="pyexepath.png" width=100% >}}

4. PowerShell을 관리자권한으로 실행

5. 다음 명령줄 입력하여 **환경변수 설정**. 이 때 따옴표 안의 경로는, **앞서 3번에서 복사한 경로** 뒤에 `\Lib\site-packages\PyQt5\Qt\plugins\platforms`를 이어 붙임. \\(역슬래시)는 한 개씩이든 두 개씩이든 상관 없음

   ```bash
   setx QT_QPA_PLATFORM_PLUGIN_PATH "C:\\Users\\---\\python\\venv\Lib\site-packages\PyQt5\Qt\plugins\platforms"
   ```

6. 재부팅

---

## 원인

문제가 발생하는 원인은 에러문구에 적힌 바와 같이, Qt platform plugin의 경로를 찾지 못했기 때문입니다.

환경변수 `QT_QPA_PLATFORM_PLUGIN_PATH`를 통해 해당 플러그인의 위치를 찾는데, 해당 내용이 설정되어 있지 않아 경로를 찾지못한다는 오류가 발생하는 것입니다.

---

## 해결책

우리가 설치해준 pyqt5 라이브러리 내에 있는 platforms 항목과 연동해주면 문제가 해결됩니다.

pip를 통해 설치하게 되면, python 경로의 `Lib\site-packages\` 안에 설치한 내용물이 보관됩니다.

python 경로는 python을 실행하여 다음 명령어를 입력하면 확인할 수 있습니다.

```python
import sys
sys.executable
```

여기서 나오는 경로는 python.exe라는 실행파일의 경로이므로, Scripts라는 폴더 이전까지의 경로 부분만 복사해둡니다.

{{< image src="pyexepath.png" width=100% >}}

이후, PowerShell을 관리자권한으로 실행하고 다음 명령어를 입력해 환경변수를 설정해 줍니다.

```bash
setx QT_QPA_PLATFORM_PLUGIN_PATH "C:\\Users\\---\\python\\venv\Lib\site-packages\PyQt5\Qt\plugins\platforms"
```

여기서 `C:\\Users\\---\\python\\venv` 부분은 여러분이 앞서 확인하신 경로로 바꿔주셔야 합니다.

앞부분 경로를 변경하고, 뒤의 `\Lib\site-packages\PyQt5\Qt\plugins\platforms` 부분만 그대로 유지하시면 됩니다.

환경변수 설정이 완료되었다면, 환경변수 적용을 위해 **재부팅**을 해주면 해결됩니다!
