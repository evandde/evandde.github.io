# Geant4 무작정 따라하기 - 13. 스코어링 기록(Ntuple)


Geant4 무작정 따라하기 시리즈의 열세번째. Geant4에서 스코어링한 결과를 파일로 기록하는 방법 중 Ntuple 형태로 기록하는 방법에 대해 알아봅니다.

<!--more-->

지난 글에 이어, 이번 글에서는 스코어링 결과를 Ntuple 형태로 기록하는 방법에 대해 알아보겠습니다. 이전 글에서 작성했던 Histogram 출력 내용과 관련한 코드는 그대로 두고, 여기에 이어서 작업을 진행하도록 하겠습니다.

---

## Ntuple 기록하기

Ntuple이란, 간단히 말해 <b>표</b>입니다. 사실은 n개의 순서쌍으로 묶인 데이터라는 뜻입니다만, 이런 데이터를 m개 쌓아놓으면 그냥 m×n 크기의 표가 됩니다. 

그래서, Ntuple로 기록하는 과정은 사용자가 표를 직접 그리듯이 작업이 진행됩니다.

1. <b>RunAction의 생성자</b>에서 <b>CreateNtuple() 함수</b>를 사용하여 Ntuple을 생성
2. <b>RunAction의 생성자</b>에서 <b>CreateNtuple?Column() 함수</b>를 사용하여 Ntuple의 <b>열</b>을 생성
3. 모든 열을 추가한 뒤, <b>RunAction의 생성자</b>에서 <b>FinishNtuple() 함수</b>를 사용하여 Ntuple의 디자인을 완성
4. <b>EventAction의 EndOfEventAction() 함수 안</b>에서 <b>FillNtuple?Column() 함수</b>를 사용하여 각 열에 데이터를 기록
5. 한 행에 해당하는 모든 열 데이터를 기록한 뒤, <b>EventAction의 EndOfEventAction() 함수 안</b>에서 <b>AddNtupleRow() 함수</b>를 사용하여 한 행만큼의 데이터를 Ntuple에 추가
6. <b>RunAction의 EndOfRunAction() 함수 안</b>에서, 출력파일을 닫기 전에 <b>Write() 함수</b>를 사용하여 데이터 기록

### Ntuple 생성 및 디자인

먼저, 다음의 세 단계를 통해 Ntuple이라는 데이터 양식을 생성하겠습니다.

1. <b>RunAction의 생성자</b>에서 <b>CreateNtuple() 함수</b>를 사용하여 Ntuple을 생성
2. <b>RunAction의 생성자</b>에서 <b>CreateNtuple?Column() 함수</b>를 사용하여 Ntuple의 <b>열</b>을 생성
3. 모든 열을 추가한 뒤, <b>RunAction의 생성자</b>에서 <b>FinishNtuple() 함수</b>를 사용하여 Ntuple의 디자인을 완성

<font color=red><b>RunAction.cc 파일을 열고, RunAction의 생성자 내</b></font>에 작성합니다 . 이전 글에서 만들었던 analysisManager라는 변수명을 가진 객체를 이용해서 Ntuple을 생성해줄 것입니다. 이 때 사용하는 함수는 CreateNtuple() 함수인데요, 이 함수의 원형부터 살펴보겠습니다.

```cpp
G4int CreateNtuple(const G4String& name, const G4String& title)
```

- name: <b>Ntuple의 이름</b>. 최종적인 출력 파일의 이름에 사용됨
- title: Ntuple의 제목. 출력된 파일 내부에서 제목으로 쓰여져 있음.

예를 들어, 이름을 "EDep"라고 짓고, 제목은 "Energy Deposition"이라고 지은 Ntuple을 만든다면 다음과 같이 입력하면 됩니다.

```cpp
analysisManager->CreateNtuple("EDep", "Energy Deposition");
```

이어서, 이 Ntuple의 열을 추가합니다. 열을 추가하는 데에 사용하는 함수들의 원형은 다음과 같습니다.

- G4int CreateNtupleIColumn(const G4String& name): <b>정수형</b>(<b>i</b>nteger) 값이 기록될 열을 추가하는 함수. 입력 인자 name은 이 열의 이름을 의미함.
- G4int CreateNtupleFColumn(const G4String& name): <b>실수형</b>(<b>f</b>loat) 값이 기록될 열을 추가하는 함수. 입력 인자 name은 이 열의 이름을 의미함.
- G4int CreateNtupleDColumn(const G4String& name): <b>실수형</b>(<b>d</b>ouble) 값이 기록될 열을 추가하는 함수. 입력 인자 name은 이 열의 이름을 의미함.
- G4int CreateNtupleSColumn(const G4String& name): <b>문자열형</b>(<b>s</b>tring) 값이 기록될 열을 추가하는 함수. 입력 인자 name은 이 열의 이름을 의미함.

데이터를 기록할 때 이 표의 열마다 어떤 자료형을 기록할 지 생각하며 <b>순서대로 추가</b>해나가면 됩니다.

여기서는 Energy Deposition 값에 해당하는 <b>한 열</b>만 기록하도록 하겠습니다. 이는 <b>실수값 double형</b>이므로, <b>CreateNtupleDColumn() 함수</b>를 이용합니다.

```cpp
analysisManager->CreateNtupleDColumn("E(MeV)");
```

<b>기록하고 싶은 데이터 열이 더 많다면 같은 방식으로 이어붙여서 더 추가</b>하시면 됩니다.

다 추가하셨다면 이제 이 디자인으로 Ntuple을 완성해야 합니다. 이 때에는 <b>FinishNtuple() 함수</b>를 사용합니다. 여기서는 한 열만 추가하기로 하였으므로, 위에 열을 추가한 내용에 이어서 FinishNtuple() 함수를 적어주면 됩니다. 다음과 같이 말이죠.

```cpp
analysisManager->FinishNtuple();
```

최종적으로 작성된 RunAction.cc 파일의 모습은 다음과 같아야 합니다.

{{< image src=12_Ntuple.png width=80% >}}

### Ntuple 작성

이제 다음의 두 단계에 해당하는 내용을 작성하겠습니다.

4. <b>EventAction의 EndOfEventAction() 함수 안</b>에서 <b>FillNtuple?Column() 함수</b>를 사용하여 각 열에 데이터를 기록
5. 한 행에 해당하는 모든 열 데이터를 기록한 뒤, <b>EventAction의 EndOfEventAction() 함수 안</b>에서 <b>AddNtupleRow() 함수</b>를 사용하여 한 행만큼의 데이터를 Ntuple에 추가

이 작업은 매 Event가 끝난 뒤 Hit을 정리할 때마다 수행해야 하므로, <font color=red><b>EventAction.cc 파일의 EndOfEventAction() 함수 내에 코드를 작성</b></font>합니다. <b>물론 `g4csv.hh`와 같은 헤더도 추가</b>해야합니다만, 앞서 Histogram할 때 추가해뒀으므로 생략하겠습니다.

현재 EventAction.cc 파일의 모습은 다음과 같을 것입니다. 

{{< image src=13_Ntuple.png width=80% >}}

여기서 아까 만들어 둔 analysisManager 객체를 활용하여 두 가지 작업을 수행할 것입니다.

먼저, <font color=red><b>EndOfEventAction() 함수</b></font> 내의 for 반복문 안에서 eDep이 0보다 큰지 확인하는 if 조건문 안에서 G4AnalysisManager 클래스가 제공하는 <b>FillNtuple?Column() 함수</b>를 이용하여 <b>Ntuple의 0번째 열에 eDep 데이터를 기록</b>합니다.

```cpp
analysisManager->FillNtupleDColumn(0, eDep);
```

CreateNtuple?Column() 함수와 동일하게 <b>I(정수)/F(실수)/D(실수)/S(문자열)의 4종류</b>가 있습니다. 대표적으로 FillNtupleDColumn() 함수의 원형만 살펴보면 다음과 같습니다.

```cpp
G4bool FillNtupleDColumn(G4int columnId, G4double value)
G4bool FillNtupleDColumn(G4int ntupleId, G4int columnId, G4double value)
```

- columnId: Ntuple에서 데이터를 기록할 <b>열의 번호</b> (0부터 시작하여 0, 1, 2, ... 로 올라감)
- value: Ntuple에 기록할 <b>데이터 값</b>
- ntupleId: Ntuple이 여러 개일 경우, 데이터를 기록할 <b>Ntuple의 ID 번호</b>. Ntuple을 생성할 때 별도로 지정하지 않았다면, <b>만든 순서대로 0, 1, 2, ...로 부여</b>됨

Ntuple을 한 개만 이용한다면 위의 함수를 이용하여 열 번호와 값만 입력하면 됩니다. Ntuple을 여러 개 이용하고 있다면 아래의 함수를 이용하여 Ntuple의 ID 번호, 열 번호, 값의 순서로 입력하면 됩니다.

모든 열을 다 추가하였다면, G4AnalysisManager 클래스가 제공하는 <b>AddNtupleRow() 함수</b>를 이용하여 한 행 단위로 마무리해 줍니다.

```cpp
analysisManager->AddNtupleRow();
```

코드를 다 적으면 다음과 같은 모양일 것입니다.

{{< image src=14_Ntuple.png width=80% >}}

### Ntuple을 파일에 기록

마지막으로, "6. <b>RunAction의 EndOfRunAction() 함수 안</b>에서, 출력파일을 닫기 전에 <b>Write() 함수</b>를 사용하여 데이터 기록"을 진행해야 합니다만, 이 내용은 <b>앞서 Histogram을 할 때 해두었으므로 여기서 따로 또 할필요는 없습니다</b>.

<font color=red><b>RunAction.cc 파일</b></font>의 <font color=red><b>EndOfRunAction() 함수</b></font>에 아까 적어둔 `analysisManager->Write();` 코드가 잘 적혀있는지 확인만 하시면 됩니다.

{{< image src=15_Ntuple.png width=90% >}}

### 결과 확인

Ntuple 기록하기도 다 끝났습니다. 이제 build 디렉토리에 들어가서, 다음 명령어를 입력하여 시뮬레이션을 수행해봅시다.

```bash
make
./g4_minimal run.mac
```

시뮬레이션이 정상적으로 종료되고 "Good bye :)"를 확인하셨다면, build 디렉토리 안에 다음 그림과 같이 G4_Minimal_nt_EDep.csv 라는 파일이 생성된 것을 확인할 수 있습니다. 여기서 알 수 있듯, 최종 히스토그램 파일의 이름은 `{OpenFile()에서 입력한 파일 이름}_nt_{CreateNtuple()에서 입력한 Ntuple이름}.csv`으로 결정됩니다.

{{< image src=16_Ntuple.png width=100% >}}

파일을 열어보시면 다음과 같이 맨 위의 헤더 형태로 적힌 Ntuple의 정보와 함께, 결과가 1열로 기록되어 있는 것을 볼 수 있습니다.

{{< image src=17_Ntuple.png width=40% >}}

{{< admonition note >}}

지금 이 결과는 `/run/beamOn 1000`으로 돌렸을 때의 결과입니다만, 기록된 Event가 많지 않네요. 

제가 돌린 시뮬레이션은 5×5×5 cm<sup>3</sup> 크기의 작은 물팬텀을 10 cm 거리에 둔 데다가, 선원도 0.662 MeV의 등방성 감마선원이라 반응 자체가 별로 일어나지 않아서 그런 것으로 판단됩니다.

{{< /admonition >}}

---

## 최종 파일 다운받는 법

지난 글과 이번 글에서 작성한 스코어링 결과 기록 관련 코드는 [이 링크](https://github.com/evandde/g4_minimal/archive/refs/heads/example.zip)를 통해 다운받을 수 있습니다.

혹은 git repository를 clone하신 분의 경우에는, example branch의 가장 최신 커밋인 V4 analysis 커밋을 참고하셔도 됩니다.

---

## 정리

이번 글에서는 스코어링한 데이터를 csv 형식으로 Ntuple 형태에 맞추어 출력하는 방법에 대해 알아보았습니다. 여기까지의 내용을 통해, 여러분은 이제 시뮬레이션 결과를 원하는 형태로 파일에 기록하여 출력할 수 있게 되었습니다.

이번 글로서 Geant4 무작정 따라하기 시리즈는 끝입니다. 다음 글에서 후기와 함께 마무리 짓도록 하겠습니다!

