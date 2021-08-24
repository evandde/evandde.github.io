# VSCode Python 환경에서 Jupyter 및 plotly 사용하기


VSCode에서 Python3 언어를 사용할 때, Jupyter와 plotly를 연동하여 사용하는 환경을 구축하는 방법에 대해 알아봅니다.

<!--more-->

{{< admonition success >}}

여기서는 <b>VSCode에서의 python3 환경을 구축한 상태</b>라고 가정합니다. 이에 관한 내용은 [이 글]({{< ref "vscode-python" >}})을 참고하세요.

{{< /admonition >}}

---

## 소개

### Jupyter

[Jupyter](https://jupyter.org/)는 프로그래밍 언어를 이용할 때 <b>인터랙티브하게 개발할 수 있는 환경을 제공</b>하는 오픈소스 소프트웨어입니다. Python과 연동하게 되면, 셀단위 실행, 변수 모니터링 등 다양한 기능을 활용할 수 있죠.

### plotly

[plotly](https://plotly.com/)는 인터랙티브하게 이용할 수 있는 데이터 가시화 패키지입니다. Python과도 연동하여 사용 가능하며, 무엇보다 UI가 고급스럽고 마우스를 이용한 여러가지 조작이 가능합니다. 데이터 가시화를 위해 가장 많이 알려진 패키지는 matplotlib입니다만, 저는 개인적으로 plotly가 더 예뻐서 이쪽을 선호합니다.

### 사용 예시

{{< image src="00_example.png" width=100% >}}



---

## Jupyter 설치 및 실행

### Extension설치

먼저 VSCode에서 Jupyter extension을 설치하겠습니다.

VSCode를 켜고, extension 탭으로 간 뒤 "<b>jupyter</b>"를 검색하세요. 맨 위에 jupyter extension이 뜰 것입니다. Install 버튼을 눌러 설치합니다.

{{< image src="01_extension_jupyter.png" width=100% >}}

### ipykernel 설치

python에서 jupyter를 사용하기 위해서는, python 패키지 중 <b>ipykernel</b>을 설치해야 합니다. VSCode에서 Jupyter를 실행해보면 ipykernel이 없는 경우 다음 그림과 같이 <b>ipykernel을 설치할 것인지 묻는 알림창이 자동으로 뜹니다</b>.

{{< image src="02_install_ipykernel.png" width=100% >}}

만약 이 창이 안뜬다면, powershell이나 vscode의 Terminal에서 다음 명령어를 입력하여 직접 설치해주셔도 됩니다.

```bash
pip install ipykernel
```

### 실행

[View] - [Command Palette]를 눌러 명령창을 띄운 뒤, "<b>jupyter interactive</b>"를 입력하여 Jupyter: Create Interactive Window를 클릭합니다. 다음 그림을 참고하세요.

{{< image src="03_run_jupyter.png" width=100% >}}

{{< image src="04_run_jupyter.png" width=100% >}}

Jupyter Interactive Window가 잘 떴다면, 아래쪽의 명령줄 부분에 명령어를 입력한 뒤 <b>[SHIFT]+[ENTER]</b> 키를 눌러 정상 동작 여부를 확인해보실 수 있습니다.

{{< image src="05_install_ipykernel.png" width=100% >}}

더불어, 창 위쪽의 Variables 버튼을 누르면 다음 그림과 같이 현재 메모리에 저장된 변수도 모니터링할 수 있습니다.

{{< image src="06_variables.png" width=100% >}}



### python 인터프리터 설정

Jupyter에서 사용할 인터프리터는 Jupyter Interactive Window의 오른쪽 위에서 선택할 수 있습니다. venv 등을 사용하고 있거나, 여러 버전의 python을 이용하는 경우에는 이를 통해 원하는 인터프리터로 변경하여 선택할 수 있습니다.

{{< image src="07_pythonselect.png" width=100% >}}



### .py 파일과의 연동

python 코드로 작성한 파일에 대해서도 Jupyter를 통해 실행시킬 수 있습니다. 테스트를 위해 main.py 파일을 만들고 다음과 같이 코드를 작성하겠습니다.

```python
# %%
arr = [1, 2, 3]

# %%
for i in arr:
    print(i)
```

여기서 주석을 `# %%`라고 달았는데요, 이렇게 달아주면 Jupyter에서 `# %%`와 다음 `# %%`까지의 영역을 <b>Cell</b>이라는 단위로 구분지어줍니다. 그러면, Jupyter에서 각 Cell 단위로 실행시키거나 디버깅을 수행해볼 수 있습니다. 다음 그림을 참고하세요.

{{< image src="08_cell.png" width=100% >}}



---

## plotly 설치 및 Jupyter 연동

### 설치

이제 <b>plotly</b>를 사용하기 위한 환경을 구축해봅시다. 

필요한 패키지는 3가지입니다.

- plotly 패키지: plotly를 사용하기 위해 당연히 필수
- nbformat 패키지: plotly를 Jupyter에서 사용하기 위해 필요한 패키지
- pandas 패키지: plotly에 넣어줄 데이터 관리를 위해 사실상 필수인 패키지

세 가지 패키지 모두 `pip`를 이용하여 설치를 할 것입니다. <b>Powershell</b>이나 <b>vscode의 Terminal</b>에서 다음 명령어를 입력하여 설치할 수 있습니다.

```bash
pip install plotly
pip install nbformat
pip install pandas
```



### 실행

모든 패키지를 설치하셨다면, <b><font color=red>실행에 앞서 Jupyter Interactive Window 창을 다시 한 번 껐다가 켜시기 바랍니다.</font></b> 그래야만 Jupyter에서 방금 설치한 패키지 상황을 인지합니다.

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
