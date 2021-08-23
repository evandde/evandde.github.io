# VSCode Python 환경에서 Jupyter 및 plotly 사용하기


VSCode에서 Python3 언어를 사용할 때, Jupyter와 plotly를 연동하여 사용하는 환경을 구축하는 방법에 대해 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 <b>VSCode에서의 python3 환경을 구축한 상태</b>라고 가정합니다. 이에 관한 내용은 [이 글]({{< ref "vscode-python" >}})을 참고하세요.

{{< /admonition >}}

---

## Jupyter Extension 설치 및 실행

### 설치

먼저 VSCode에서 Jupyter extension을 설치하겠습니다.

VSCode를 켜고, extension 탭으로 간 뒤 "<b>jupyter</b>"를 검색하세요. 맨 위에 jupyter extension이 뜰 것입니다. Install 버튼을 눌러 설치합니다.

{{< image src="01_extension_jupyter.png" width=100% >}}

### 실행

[View] - [Command Palette]를 눌러 명령창을 띄운 뒤, "<b>jupyter interactive</b>"를 입력하여 Jupyter: Create Interactive Window를 클릭합니다. 다음 그림을 참고하세요.

{{< image src="02_run_jupyter.png" width=100% >}}

{{< image src="03_run_jupyter.png" width=100% >}}



---

## ipykernel 설치

### 설치

python에서 jupyter를 사용하기 위해서는, python 패키지 중 <b>ipykernel</b>을 설치해야 합니다. VSCode에서 Jupyter를 실행해보면 ipykernel이 없는 경우 다음 그림과 같이 <b>ipykernel을 설치할 것인지 묻는 알림창이 자동으로 뜹니다</b>.

{{< image src="04_install_ipykernel.png" width=100% >}}

만약 이 창이 안뜬다면, powershell이나 vscode의 Terminal에서 다음 명령어를 입력하여 직접 설치해주셔도 됩니다.

```bash
pip install ipykernel
```

### 실행

설치를 다 하셨다면, <b><font color=red>Jupyter Interactive Window 창을 껐다가 다시 켜보세요</font></b>. 이후, 아래쪽의 명령줄 부분에 명령어를 입력한 뒤 <b>[SHIFT]+[ENTER]</b> 키를 눌러 정상 동작 여부를 확인해보실 수 있습니다.

{{< image src="05_install_ipykernel.png" width=100% >}}

---

## plotly 설치 및 Jupyter 연동

### 설치

이제 <b>plotly 패키지</b>를 설치하겠습니다. powershell이나 vscode의 Terminal에서 다음 명령어를 입력하여 설치할 수 있습니다.

```bash
pip install plotly
```

그리고 plotly를 Jupyter에서 사용하기 위해 추가적으로 <b>nbformat 패키지</b>도 설치해야 합니다. `pip`를 이용하여 마찬가지로 쉽게 설치할 수 있습니다. 다음 명령어를 입력하세요.

```bash
pip install nbformat
```

여기까지가 필수 패키지입니다만, plotly를 사용하려면 사실상 <b>pandas 패키지</b>도 필요합니다. 다음 명령어를 통해 pandas 패키지도 설치해줍니다.

```bash
pip install pandas
```



### 실행

모든 패키지를 설치하셨다면, <b><font color=red>실행에 앞서 Jupyter Interactive Window 창을 다시 한 번 껐다가 켜시기 바랍니다.</font></b>

이제 간단한 예제를 통해 테스트를 해봅시다. 다음 코드는 plotly 홈페이지에서 제공하는 공식 예제 중 하나입니다. ([참고링크](https://plotly.com/python/plotly-express/))

앞서 Jupyter의 test를 수행했던 명령줄에 다음 코드를 입력한 뒤, <b>[SHIFT]+[ENTER]</b> 키를 눌러줍니다. 참고로, 명령줄 내에서 그냥 [ENTER] 키를 누르시면 줄바꿈이 됩니다.

```python
import plotly.express as px
df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.show()
```

다음 그림과 같이, 실행 결과로 그래프가 잘 나오면 성공입니다.

{{< image src="06_plotly.png" width=100% >}}

{{< image src="07_plotly.png" width=100% >}}

---

## Reference

[Project Jupyter | Home](https://jupyter.org/)

[Working with Jupyter Notebooks in Visual Studio Code](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)

[Plotly: The front end for ML and data science models](https://plotly.com/)
