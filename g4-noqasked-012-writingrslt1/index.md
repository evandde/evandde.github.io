# Geant4 무작정 따라하기 - 12. 스코어링 기록(Histogram)


Geant4 무작정 따라하기 시리즈의 열두번째. Geant4에서 스코어링한 결과를 파일로 기록하는 방법, 그 중에서도 Histogram 형태로 기록하는 방법에 대해 알아봅니다.

<!--more-->

지난 글을 통해, 원하는 물리량을 스코어링 한 뒤 화면에 출력하는 작업까지 알아보았습니다. 이번 글과 다음 글에서는 이 스코어링 결과를 추후 분석작업에 용이하게 활용할 수 있도록 적절한 형태로 파일에 기록하는 방법을 알아보겠습니다.

이 시리즈에서 알아볼 기록 방법은 다음의 두 가지입니다.

- **Histogram**으로 기록: 매 Event마다 얻은 값을 히스토그램으로 만들어, 히스토그램의 각 계급구간 별 도수만 기록하는 방식
- **Ntuple**로 기록: 매 Event마다 얻은 값(화면에 출력하던 것)을 표 형태로 만들어 파일에 기록하는 방식

<b>Histogram과 Ntuple은 전부 독립적으로 관리되므로, 하나의 시뮬레이션 내에서 Histogram과 Ntuple을 원하는만큼 여러 개 기록하여도 괜찮습니다.</b>

이번 글에서는 기본 이론 및 Histogram 기록 방법을 다루고, 다음 글에서는 Ntuple을 다루겠습니다.

---

## Geant4에서의 데이터 출력

Geant4는 데이터를 정리하여 파일 형태로 출력하는 방식으로 다음의 4가지를 지원합니다. (10.7 버전 기준)

- ROOT
- HDF5
- AIDA XML
- CSV

Geant4를 개발한 CERN 그룹에서 ROOT도 개발했기 때문인지, ROOT쪽과 연계해서 이용할 때 좀 더 많은 기능이 제공됩니다.

하지만 여기서는 제일 일반적으로 어느 프로그램에서나 무난하게 사용가능한 <b>CSV 형식으로 출력하는 방법</b>에 대해 알아볼 것입니다.

### CSV란?

CSV란 comma-separated values의 약자로, 표 형태의 데이터를 comma(,)로 구분하여 텍스트 형식으로 기록하는 방식입니다. 행끼리는 줄바꿈으로 분리되며, 열끼리는 comma(,)로 분리된다고 보시면 됩니다. 경우에 따라 comma(,) 대신 공백이나 탭 등의 구분자로 대체되기도 합니다.

예를 들어 다음과 같은 표를 생각해 봅시다.

| 이름   | 학번     | 생년월일 |
| ------ | -------- | -------- |
| 홍길동 | 20201234 | 20020101 |
| 임꺽정 | 20215678 | 20030201 |

위 표를 csv 형식으로 쓰면 다음과 같습니다.

```csv
이름, 학번, 생년월일
홍길동, 20201234, 20020101
임꺽정, 20215678, 20030201
```

CSV파일은 일반적으로 엑셀, 구글시트 등과 같이 표를 다루는 프로그램에서 쉽게 불러올 수 있으며, 대부분의 데이터 분석용 프로그램들 또한 CSV 파일을 읽어들이는 기능을 제공하고 있으니 편리하게 사용할 수 있으리라 생각합니다.

### RunAction이란?

지난 글에서 매 Event마다 무언가 작업을 수행하고 싶을 때 EventAction이라는 것을 이용한다고 하였지요. 마찬가지로, <b>매 Run마다 무언가 작업을 수행</b>하고 싶은 경우에는 <b>RunAction</b>을 이용하면 됩니다.

이 글에서는 RunAction.cc 파일에서 매우 많은 작업을 해야하기 때문에, 간단하게 짚고 넘어가려 합니다.

RunAction.cc 파일에 보면 함수가 총 4개 있습니다. 각 함수의 역할은 다음과 같습니다.

- RunAction()

  "생성자"라고 부릅니다. 뭔지 모른다면 일단 이름만 기억해두고 넘어가셔도 됩니다.

- ~RunAction()

  "소멸자"라고 부릅니다. 뭔지 모른다면 일단 이름만 기억해두고 넘어가셔도 됩니다.

- BeginOfRunAction()

  <b>매 Run이 시작되기 직전 호출되는 함수입니다.</b>

- EndOfRunAction()

  <b>매 Run이 끝난 직후 호출되는 함수입니다.</b>

---



## G4AnalysisManager로 파일 관리

{{< admonition warning >}}

작성하는 파일과 위치가 매우 자주 바뀝니다. 차분하게 따라오세요.

{{< /admonition >}}

### 원하는 출력 형식의 헤더 포함시키기

Geant4에서는 관련 기능을 사용할 수 있도록 G4AnalysisManager라는 클래스를 제공합니다. 사용자는 위에 설명한 4가지 파일 형식 중 어떤 것을 사용하든, 모두 다 동일한 G4AnalysisManager라는 클래스와 이 클래스에 포함된 함수를 이용하도록 되어있습니다. 때문에, <font color=red><b>사용자가 헤더를 포함시킬 때 위 4가지 중 어떤 것을 이용할 지 명시</b></font>해줘야 합니다.

일단, <font color=red><b>RunAction.cc 파일</b></font>을 엽니다. 다음 그림과 같이 별다른 내용이 없을 것입니다.

{{< image src=01_RunAction.png width=60% >}}

여기서 맨 위에 헤더를 쓰는 부분에 원하는 출력 형식에 따라 다음의 헤더를 추가합니다. 

(다른 헤더와 달리 <b>소문자로 입력해야 함</b>에 주의)

- ROOT: `g4root.hh`
- HDF5: `g4hdf5.hh` (Geant4를 설치할 때 HDF5를 연동하여 설치한 경우에만 이용 가능)
- AIDA XML: `g4xml.hh`
- CSV: `g4csv.hh`

우리는 CSV를 이용하기로 하였으므로, 헤더를 포함하는 부분에 다음을 입력합니다.

```cpp
#include "g4csv.hh"
```

입력한 모습은 다음과 같을 것입니다.

{{< image src=02_RunAction.png width=60% >}}

이런 헤더를 포함시키고 나면, G4AnalysisManager라는 클래스를 이용할 수 있게 됩니다. 여기서는 `g4csv.hh`를 포함시켰지만, 다른 헤더를 포함시켰다고 하더라도 <b>이하의 내용은 동일하게 진행</b>하시면 됩니다.

### G4AnalysisManager의 핸들 만들기

G4AnalysisManager를 이용하려면 이 클래스의 객체를 생성해야할 것입니다.

Geant4의 공식 가이드에서는 이 클래스의 객체를 RunAction의 생성자에서 만들고, RunAction의 소멸자에서 파괴할 것을 권장합니다. <u>무슨 말인지 모르셔도 괜찮습니다. 그냥 따라오세요.</u>

일단 <font color=red><b>생성자인 RunAction()의 중괄호({}) 안</b></font>에 다음과 같이 적어줍니다.

```cpp
auto analysisManager = G4AnalysisManager::Instance();
```

그리고, <font color=red><b>소멸자인 ~RunAction()의 중괄호({}) 안</b></font>에는 다음과 같이 적어줍니다.

```cpp
delete G4AnalysisManager::Instance();
```

다 적으셨다면 다음 그림과 같이 되어있어야 합니다.

{{< image src=03_RunAction.png width=70% >}}

<b>이제부터 여러분은 어디에서든 다음 코드만 입력하면 analysisManager라는 변수명으로 G4AnalysisManager를 이용할 수 있습니다.</b>

```cpp
auto analysisManager = G4AnalysisManager::Instance();
```

### G4AnalysisManager로 파일 열기

이제 실제로 출력 파일을 만들어봅시다. 출력파일을 <b>매 Run이 시작될 때마다 열어주기 위해, <font color=red>BeginOfRunAction() 함수 내</font>에 적어주도록 합니다</b>. 파일을 열 때에는 기본적으로 G4AnalysisManager 클래스가 제공하는 <b>OpenFile()이라는 함수</b>를 제공합니다. 이 함수의 입력인자로 <b>파일의 이름</b>을 적어줄 수 있습니다. 다음과 같이 작성해봅시다.

```cpp
auto analysisManager = G4AnalysisManager::Instance();
analysisManager->OpenFile("G4_Minimal");
```

G4AnalysisManager의 객체를 가져오고, 그 객체로 OpenFile() 함수를 사용한 것입니다. 작성한 코드의 모습은 다음과 같습니다.

{{< image src=04_RunAction.png width=70% >}}

이 OpenFile() 함수의 원형은 다음과 같습니다.

```cpp
G4bool OpenFile(const G4String& fileName = "")
```

- <i>fileName: <b>출력파일의 이름. 사용자가 원하는 이름으로 입력하여 사용.</b> 입력하지 않아도 되며, 기본값은 ""(빈 문자열). 이 함수로 이름을 입력하지 않은 경우에는, 정상 동작을 위해 SetFileName() 등과 같은 별도의 출력파일의 이름을 설정하는 함수를 이용해야 함</i>

이름을 아예 지정하지 않으면 다음과 같은 경고 문구가 출력되며, 출력파일이 아예 열리지 않습니다.

> -------- WWWW ------- G4Exception-START -------- WWWW -------
>
> \*** G4Exception : Analysis_W001
>
> ​      issued by : G4VFileManager::OpenFile()
>
> Cannot open file. File name is not defined.
>
> \*** This is just a warning message. ***
>
> -------- WWWW -------- G4Exception-END --------- WWWW -------

### G4AnalysisManager로 파일 닫기

파일을 열었다면 내용을 다 적은 뒤에 파일을 닫는 작업까지 해주어야 합니다. 데이터를 어떻게 기록하는지에 대해서는 조금 뒤에 다루기로 하고, <b>파일을 닫는 것</b>부터 해보도록 합시다.

매 Run이 시작될 때 파일을 열었으니, 매 Run이 끝날 때 파일을 닫는 것이 좋겠지요. 따라서 이 내용은 <font color=red><b>EndOfRunAction() 함수 내에 적도록 합니다</b></font>. 파일을 닫기 위해서는 G4AnalysisManager 클래스가 제공하는 <b>CloseFile() 함수</b>를 이용합니다. 다음과 같이 작성해봅시다.

```cpp
auto analysisManager = G4AnalysisManager::Instance();
analysisManager->CloseFile();
```

G4AnalysisManager의 객체를 가져오고, 그 객체로 CloseFile() 함수를 사용한 것입니다. 작성한 코드의 모습은 다음과 같습니다.

{{< image src=05_RunAction.png width=70% >}}

이 CloseFile() 함수의 원형은 다음과 같습니다.

```cpp
G4bool CloseFile(G4bool reset = true)
```

- <i>reset: <b>입력하지 않아도 되는 인자</b>. 파일을 닫을 때, 메모리에 저장된 데이터를 reset시킬 지 여부에 대한 인자.기본값은 true</i>

---

## Histogram 기록하기

Histogram으로 기록하기 위해서는 다음의 세 가지만 수행하면 됩니다.

1. <b>RunAction의 생성자</b>에서 <b>CreateH1() 함수</b>를 사용하여 히스토그램을 생성
2. <b>EventAction의 EndOfEventAction() 함수 안</b>에서 <b>FillH1() 함수</b>를 사용하여 데이터 누적
3. <b>RunAction의 EndOfRunAction() 함수 안</b>에서, 출력파일을 닫기 전에 <b>Write() 함수</b>를 사용하여 데이터 기록

### Histogram 생성

먼저 "1. <b>RunAction의 생성자</b>에서 <b>CreateH1() 함수</b>를 사용하여 히스토그램을 생성 작업"을 수행하겠습니다.

<font color=red><b>RunAction의 생성자</b></font>로 돌아갑니다. 여기에서 아까 만들어둔 analysisManager라는 변수명을 가진 객체를 이용해서 히스토그램을 생성해줄 것입니다. 이 때 사용하는 함수는 CreateH1() 함수인데요, 이 함수의 원형부터 살펴보겠습니다.

```cpp
G4int CreateH1(const G4String& name, const G4String& title,
               G4int nbins, G4double xmin, G4double xmax,
               const G4String& unitName = "none",
               const G4String& fcnName = "none",
               const G4String& binSchemeName = "linear");
G4int CreateH1(const G4String& name, const G4String& title,
               const std::vector<G4double>& edges,
               const G4String& unitName = "none",
               const G4String& fcnName = "none");
```

- name: <b>히스토그램의 이름</b>. 최종적인 출력 파일의 이름에 사용됨
- title: 히스토그램의 제목. 출력된 파일 내부에서 제목으로 쓰여져 있음.
- nbins: <b>히스토그램의 계급의 개수</b>
- xmin: <b>히스토그램의 계급의 최솟값</b>
- xmax: <b>히스토그램의 계급의 최댓값</b>
- edges: 히스토그램의 구간 경계. G4double 벡터 자료형으로 입력
- <i>unitName: <b>입력하지 않아도 되는 인자</b>. 히스토그램의 정보 중 단위에 대한 내용을 저장. 기본값은 "none"</i>
- <i>fcnName: <b>입력하지 않아도 되는 인자</b>. 기본값은 "none"</i>
- <i>binSchemeName: <b>입력하지 않아도 되는 인자</b>. 기본값은 "linear"</i>

위쪽의 함수 원형은 최소, 최대, 구간 개수로 히스토그램을 정의하는 방식이고, 아래쪽의 함수 원형은 구간의 경계를 이용하여 히스토그램을 정의하는 방식입니다. 이 시리즈에서는 위쪽의 것만 설명하겠습니다.

이 시리즈에서 앞서 스코어링한 물리량은 물 팬텀에 deposit된 에너지였습니다. 이를 <b>0 MeV ~ 3.0 MeV까지 1024개의 구간</b>으로 나누어 히스토그램을 만들어봅시다. 이 경우 <b>RunAction.cc 파일의 생성자</b>에 다음과 같이 코드를 추가하면 됩니다. <b>다만, 여기서 MeV라는 단위를 사용하기 위해서는 헤더쪽에 "G4SystemOfUnits.hh"를 포함시켜야 한다는 점도 잊지마세요.</b>

```cpp
analysisManager->CreateH1("EDep", "Energy Deposition", 1024, 0., 3. * MeV);
```

히스토그램의 이름은 "EDep", 제목은 "Energy Deposition"이며, 0 MeV ~ 3 MeV의 구간을 1024개로 쪼개어 히스토그램을 생성하였습니다.

실제 작성된 RunAction.cc 파일의 모습은 다음과 같아야 합니다.

{{< image src=06_Hist.png width=80% >}}



### Histogram에 데이터 누적

이제 "2. <b>EventAction의 EndOfEventAction() 함수 안</b>에서 <b>FillH1() 함수</b>를 사용하여 데이터 누적" 작업을 수행하겠습니다.

이 작업은 매 Event가 끝난 뒤 Hit을 정리할 때마다 수행해야 하므로, <font color=red><b>EventAction.cc 파일의 EndOfEventAction() 함수 내에 코드를 작성</b></font>합니다. <b>물론 헤더도 추가</b>해야합니다.

{{< admonition warning >}}

작성하는 위치에 주의하세요.

{{< /admonition >}}

현재 EventAction.cc 파일의 모습은 다음과 같을 것입니다. 

{{< image src=07_Hist.png width=80% >}}

여기서 다음의 세 가지 작업을 할 것입니다.

1. 파일의 맨 위에 CSV용 G4AnalysisManager 사용을 위해, `g4csv.hh` 헤더 포함

   ```cpp
   #incldue "g4csv.hh"
   ```

   

2. EndOfEventAction() 함수 내, for 반복문의 위쪽에 G4AnalysisManager 객체를 만듦

   ```cpp
   auto analysisManager = G4AnalysisManager::Instance();
   ```

   

3. EndOfEventAction() 함수 내, for 반복문 안에서 eDep이 0보다 큰지 확인하는 if 조건문 안에 히스토그램에 누적하는 내용을 작성

   ```cpp
   analysisManager->FillH1(0, eDep);
   ```
   
   여기서 사용된 FillH1() 함수의 원형은 다음과 같습니다.
   
   ```cpp
   G4bool G4VAnalysisManager::FillH1(G4int id, G4double value, G4double weight = 1.0)
   ```
   
   - id: <b>히스토그램의 ID</b>. 앞서 히스토그램을 생성할 때 별도로 설정하지 않았다면, <b>만들어진 순서대로 0, 1, 2, ... 와 같이 부여</b>됨.
   - value: <b>히스토그램에 누적시킬 값</b>.
   - <i>weight: <b>입력하지 않아도 되는 인자</b>. 히스토그램에 값을 누적시킬 때의 가중치. 기본값은 1.0</i>
   
   <b>히스토그램의 ID 번호</b>와 <b>누적시킬 값</b>을 입력해서 사용하면 됩니다.

추가적으로, 이제 화면에 출력할 필요가 없으니 "G4SystemOfUnits.hh" 헤더와 G4cout 줄은 삭제해도 괜찮습니다. 다 마무리하면 다음과 같은 모양일 것입니다.

{{< image src=08_Hist.png width=80% >}}

### Histogram을 파일에 기록

마지막으로, "3. <b>RunAction의 EndOfRunAction() 함수 안</b>에서, 출력파일을 닫기 전에 <b>Write() 함수</b>를 사용하여 데이터 기록"을 진행하겠습니다.

다시 <font color=red><b>RunAction.cc 파일</b></font>로 돌아옵니다. 여기서 <font color=red><b>EndOfRunAction() 함수</b></font>에서 아까 적어둔 CloseFile() 함수 줄 바로 위에, G4AnalysisManager 클래스가 제공하는 Write() 함수를 사용해주면 됩니다. 코드로는 다음과 같습니다.

```cpp
analysisManager->Write();
```

작성하고 나면 다음과 같은 모습일 것입니다.

{{< image src=09_Hist.png width=80% >}}

### 결과 확인

다 끝났습니다. 이제 build 디렉토리에 들어가서, 다음 명령어를 입력하여 시뮬레이션을 수행해봅시다.

```bash
make
./g4_minimal run.mac
```

시뮬레이션이 정상적으로 종료되고 "Good bye :)"를 확인하셨다면, build 디렉토리 안에 다음 그림과 같이 G4_Minimal_h1_EDep.csv 라는 파일이 생성된 것을 확인할 수 있습니다. 여기서 알 수 있듯, 최종 히스토그램 파일의 이름은 `{OpenFile()에서 입력한 파일 이름}_h1_{CreateH1()에서 입력한 히스토그램이름}.csv`으로 결정됩니다.

{{< image src=10_Hist.png width=90% >}}

파일을 열어보시면 다음과 같이 맨 위의 헤더 형태로 적힌 히스토그램의 정보와 함께, 히스토그램 결과가 5열로 기록되어 있는 것을 볼 수 있습니다.

{{< image src=11_Hist.png width=40% >}}

여기서 각 열은 순서대로 다음과 같습니다.

- entries: 각 계급 구간의 도수 (값이 구간에 들어온 개수) 
- Sw: 가중치의 합 (기본적으로 가중치는 1이며, 모든 가중치가 1인 경우 entries와 값이 동일함. 이 가중치는 variance reduction 등에 관한 내용이므로 생략)
- Sw2: 가중치의 제곱합 (기본적으로 가중치는 1이며, 모든 가중치가 1인 경우 entries와 값이 동일함. 이 가중치는 variance reduction 등에 관한 내용이므로 생략)
- Sxw0: 기록한 값과 가중치의 곱의 합. (기록한 값이란, 히스토그램에 누적하기 위해 입력한 실제 값을 의미함)
- Sx2w0: 기록한 값의 제곱과 가중치의 곱의 합.

각 행은 계급 구간의 좌우 경계 값에 대해 <b>왼쪽 값 이상~오른쪽 값 미만</b>의 범위에 들어온 데이터에 대해 기록됩니다. 또한, 총 행의 수는 CreateH1() 함수에서 기록한 개수보다 2개 더 많으며, <b>맨 첫 행에 최솟값 미만</b>인 경우, <b>맨 마지막 행에 최댓값 이상</b>인 경우가 추가적으로 기록됩니다.

---

## 정리

이번 글에서는 스코어링한 데이터를 csv 형식으로 Histogram 형태에 맞추어 출력하는 방법에 대해 알아보았습니다. 다음 글에서는 이어서 Ntuple 형태에 맞추어 출력하는 방법에 대해 알아보겠습니다.

