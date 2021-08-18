# Geant4 무작정 따라하기 - 11. 스코어링 구현


Geant4 무작정 따라하기 시리즈의 열한번째. Geant4에서 스코어링을 구현하는 방법에 대해 알아봅니다.

<!--more-->

지난 글에서 살펴본 스코어링 이론을 바탕으로, 이번 글에서는 스코어링을 직접 구현해보도록 하겠습니다.

스코어링을 구현하는 방법은 크게 다음의 3단계를 통해 진행됩니다.

1. 스코어링을 위한 Sensitive Detector 설계
2. 관심 있는 지오메트리의 Logical Volume에 Sensitive Detector를 세팅
3. Event가 끝날 때 HCofThisEvent에서 Hit(관심 있는 물리량)을 꺼내어 확인

차례차례 살펴보도록 합시다.

---

## Sensitive Detector 설계

Sensitive Detector를 설계하는 방법은 지난 글에서 말씀드렸습니다. 이 시리즈에서는 Multi Functional Detector(MFD)에 사용자가 원하는 Primitive Scorer들을 Register하여 설계하는 방법만 다루겠다고 하였지요.

이 내용을 코드로 입력하는 곳도 정해져 있습니다. 바로 <b>DetectorConstruction.cc 파일</b>에 있는 <b>ConstructSDandField() 함수 내부</b>입니다. DetectorConstruction.cc 파일을 열어보시면, 대부분의 경우 맨 아래쪽 부근에 다음과 같은 함수가 있을 것입니다. 이 함수의 중괄호({}) 내부에 작성할 것입니다.

{{< image src="01_consdandfield.png" width=100% >}}

### MFD 만들고 추가하기

Multi Functional Detector를 만드는 과정은 딱 두 가지만 하시면 됩니다.

1. G4MultiFunctionalDetector 클래스의 객체를 만든다.
2. 해당 객체를 G4SDManager에 추가한다.

코드로는 다음의 두 줄입니다.

```cpp
auto mfd = new G4MultiFunctionalDetector("Detector");
G4SDManager::GetSDMpointer()->AddNewDetector(mfd);
```

mfd라는 변수명으로 객체를 만들고, 이를 추가해주었습니다.

좀 더 자세히 살펴보도록 하죠.

#### MFD 객체 만들기

Geant4에서는 Multi Functional Detector를 만들기 위해 이름 그대로 G4MultiFunctionalDetector라는 클래스를 제공하고 있습니다. 사용자는 이 클래스의 생성자를 이용하여 객체를 한 개 만들어주면 됩니다.

이 클래스의 생성자는 다음과 같습니다.

```cpp
G4MultiFunctionalDetector(G4String name)
```

- name: Multi Functional Detector의 이름. 자유롭게 적으면 됨. <b>나중에 쓰이는 값이므로 기억</b>해둘 것

문자열 형태의 입력값 한 개만 자유롭게 넣어주면 됩니다. 입력 인자로 넣어준 <b>이 값은 MFD의 이름</b>이 되는데, 나중에 HCofThisEvent에서 사용되니 적절한 이름으로 잘 지어주세요. 위 예시 코드에서는 "Detector"라는 이름을 지어주었습니다.

#### MFD 추가하기

Geant4에서 Sensitive Detector를 사용하기 위해서는 <b>반드시 G4SDManager에 그 SD를 추가</b>해주어야 합니다. 그래야 Geant4가 입자를 수송하면서 SD 목록 중 조건에 부합하는 것들에 대해 스코어링을 수행해주기 때문입니다.

G4SDManager는 Geant4가 제공하는 것을 가져다 쓰면 되며, 이 클래스가 제공하는 <b>AddNewDetector()라는 함수를 통해 우리가 설계한 SD를 추가</b>하게 됩니다. 이 함수의 원형은 다음과 같습니다.

```cpp
void AddNewDetector(G4VSensitiveDetector *aSD)
```

- aSD: 추가할 Sensitive Detector 객체의 포인터

{{< admonition note >}}

C++적인 내용을 덧붙이자면, G4MultiFunctionalDetector 클래스는 G4VSensitiveDetector 클래스를 상속받아 만들어진 클래스입니다. 따라서, MFD 객체를 AddNewDetector의 인자로 사용할 수 있는 것입니다.

{{< /admonition >}}

이 함수의 입력 인자로, 앞서 저희가 만들어둔 MFD 객체를 그대로 써주시면 됩니다.

### PS 등록하기

이제 MFD는 만들었으니, 실제 스코어링 기능을 수행하는 Primitive Scorer를 등록해야 합니다. 이 내용도 <b>ConstructSDandField() 함수 내부</b>에 위에서 작성한 두 줄에 이어서 계속 써주시면 됩니다.

여기도 딱 두 가지만 해주시면 됩니다.

1. 원하는 Primitive Scorer 클래스의 객체를 만든다.
2. 해당 PS 객체를 MFD에 등록한다.

예를 들어 해당 지오메트리 내에 deposit된 에너지의 총합을 스코어링하는 G4PSEnergyDeposit을 등록하고 싶다면, 다음과 같이 두 줄을 작성하면 됩니다.

```cpp
auto psEDep = new G4PSEnergyDeposit("EDep");
mfd->RegisterPrimitive(psEDep);
```

psEDep이라는 변수명으로 G4PSEnergyDeposit 클래스의 객체를 만들고, 이를 앞서 만들어둔 mfd 변수명으로 정의된 MFD 객체에 등록해주었습니다.

좀 더 자세히 살펴보겠습니다.

#### PS 객체 만들기

Primitive Scorer의 종류가 너무 많기 때문에, 이 글에서 모든 PS의 생성자를 살펴볼 수는 없습니다. 하지만 <b>모든 PS의 생성자에 있어 공통적으로 중요한 내용</b>이 있습니다. 대표적으로 G4PSEnergyDeposit 클래스의 생성자를 살펴봅시다.

```cpp
G4PSEnergyDeposit(G4String name, G4int depth=0)
G4PSEnergyDeposit(G4String name, const G4String& unit, G4int depth=0)
```

- name: Primitive Scorer의 이름. 자유롭게 적으면 됨. <b>나중에 쓰이는 값이므로 기억</b>해둘 것
- <i>depth:  <b>입력하지 않아도 되는 인자</b>.지오메트리의 관계(mother-daughter)에 따라, 상위 몇 번째 단계에 있는 지오메트리의 copy number를 참고할 것인지를 지정하는 인자. 기본값은 0</i>
- <i>unit:  <b>입력하지 않아도 되는 인자</b>. 스코어링 결과의 입출력시 사용할 단위. 기본값은 MeV</i>

MFD 객체를 만들 때와 마찬가지로, 문자열 형태의 입력값 한 개만 자유롭게 넣어주면 됩니다. 이 <b>입력 인자는 어느 PS를 사용하든 무조건 입력해주도록 되어있으며, 이 값이 해당 PS의 이름</b>이 됩니다. 

이 또한 나중에 HCofThisEvent에서 사용되니 적절한 이름으로 잘 지어주세요. 위 예시 코드에서는 "EDep"라는 이름을 지어주었습니다.

#### MFD에 PS 등록하기

MFD에 PS를 등록할 때에는, G4MultiFunctionalDetector 클래스가 제공하는 <b>RegisterPrimitive() 함수를 이용</b>합니다. 이 함수의 원형은 다음과 같습니다.

```cpp
G4bool RegisterPrimitive(G4VPrimitiveScorer *aPS)
```

- aPS: 등록할 Primitive Scorer 객체의 포인터

이 함수의 입력 인자로, 앞서 저희가 만들어둔 PS의 객체를 그대로 써주시면 됩니다.

#### 여러 개의 PS를 등록하는 법

하나의 MFD에 여러 개의 PS를 등록하는 방법도 간단합니다. 위에서 설명한 두 과정만 계속 반복해주시면 됩니다.

1. 원하는 Primitive Scorer 클래스의 객체를 만든다.
2. 해당 PS 객체를 MFD에 등록한다.

예를 들어 MFD를 만들고 G4PSEnergyDeposit과 G4PSDoseDeposit 두 개의 PS를 등록하는 경우를 코드로 작성한다면 다음과 같습니다.

```cpp
auto mfd = new G4MultiFunctionalDetector("Detector");
G4SDManager::GetSDMpointer()->AddNewDetector(mfd);
auto psEDep = new G4PSEnergyDeposit("EDep");
mfd->RegisterPrimitive(psEDep);
auto psDoseDep = new G4PSDoseDeposit("DoseDep");
mfd->RegisterPrimitive(psDoseDep);
```

#### Filter 세팅하기

Filter는 PS의 추가옵션 같은 기능입니다. Filter를 세팅하기 위해서는 PS를 등록할 때 Filter 관련 내용을 추가해야 합니다.

1. 원하는 Primitive Scorer 클래스의 객체를 만든다.
2. <font color=red>원하는 Filter 클래스의 객체를 만든다.</font>
3. <font color=red>해당 Filter 객체를 PS에 세팅한다.</font>
4. 해당 PS 객체를 MFD에 등록한다.

예를 들어, G4PSEnergyDeposit을 이용하는데, 전자(e-)가 deposit한 값만 스코어링하고 싶다면, 다음과 같이 작성하면 됩니다.

{{< highlight cpp "hl_lines=2 3" >}}
auto psEDep = new G4PSEnergyDeposit("EDep");
auto filterElectron = new G4SDParticleFilter("e-Filter", "e-");
psEDep->SetFilter(filterElectron);
mfd->RegisterPrimitive(psEDep);
{{< /highlight >}}

각 Filter마다 생성자의 형태나 사용방법은 상이하므로, 여기서 자세히 다루지는 않겠습니다.

---

## Logical Volume에 SD 세팅

이제 관심 있는 지오메트리의 Logical Volume에, 앞서 설계한 SD를 세팅해줄 차례입니다. 이 내용 또한 <b>ConstructSDandField() 함수 내부</b>에 작성하며, 아주 간단하게 한 줄이면 끝납니다. <b>SetSensitiveDetector() 함수</b>를 사용하면 됩니다.

예를 들어, <b>"phantom"이라는 이름</b>을 가진 Logical Volume에 앞서 만든 <b>mfd</b> 변수명을 가진 SD를 세팅한다면, 다음과 같이 입력하면 됩니다.

```cpp
SetSensitiveDetector("phantom", mfd);
```

좀 더 자세히 살펴보도록 합시다. 이 함수의 원형은 다음과 같습니다.

```cpp
void SetSensitiveDetector(const G4String& logVolName,
                          G4VSensitiveDetector* aSD, G4bool multi = false)
void SetSensitiveDetector(G4LogicalVolume* logVol, G4VSensitiveDetector* aSD);
```

- logVolName: 관심 있는 지오메트리의 <b>Logical Volume의 이름</b>
- aSD: Sensitive Detector 객체의 포인터
- <i>multi:  <b>입력하지 않아도 되는 인자</b>. logVolName 이름을 가진 지오메트리가 여러 개일 경우, 여러 개의 지오메트리 모두에 대해 SD를 세팅할지의 여부를 결정하는 인자. 기본값은 false</i>
- logVol: 관심 있는 지오메트리의 <b>Logical Volume 객체의 포인터</b>

SetSensitiveDetector 함수를 사용할 때, 관심 있는 지오메트리의 Logical Volume을 입력하는 방법이 두 가지입니다.

1. Logical Volume의 이름을 입력
2. Logical Volume 객체의 포인터를 입력

일단 이 시리즈에서 추천하는 바는 <b>그냥 Logical Volume의 이름을 입력하는 것</b>입니다. 제가 이전에 [Logical Volume을 정의하는 방법에 대해 적은 글]({{< ref "g4-noqasked-004-material/#logical-volume-정의하기" >}})에서, <b>Logical Volume의 이름을 지을 때 다른 Logical Volume과 겹치지 않게끔 고유의 이름을 권장</b>한다고 하였습니다. 그 이유 중 하나가 이것입니다. 이름이 중복되면 그 중 어느 지오메트리에 SD를 세팅할 지가 불분명하기 때문입니다.

물론, 이름이 중복되는 모든 Logical Volume들에게 다 동일한 SD를 세팅하고자 한다면, 이 함수의 <i>multi</i> 인자 값을 true로 설정하여 사용할 수도 있습니다.

{{< admonition note >}}

이 시리즈에서는 지역변수나 변수의 범위(scope) 등을 설명하기에는 지면이 부족하여, 그냥 Logical Volume의 이름을 사용하는 방법만 설명합니다.

일반적으로 Logical Volume 객체는 Construct() 함수 내에 지역변수로 만들기 때문에, ConstructSDandField() 함수에서는 그 객체를 호출하지 못하기 때문이지요.

물론 객체를 불러오기 위한 몇 가지 방법들이 있습니다만 여기서는 생략하도록 하겠습니다.

{{< /admonition >}}

---

## 중간 점검

여기까지의 내용은 모두 <b>DetectorConstruction.cc 파일</b>에 있는 <b>ConstructSDandField() 함수 내부</b>에 작성하셨을 것입니다. 모두 마무리하셨다면, 일단 SD를 설계하고 이를 Logical Volume에 세팅하는 것까지 마친 상태입니다.

예를 들어 <b>G4PSEnergyDeposit 클래스를 이용하여 설계한 SD</b>를 <b>"phantom"이라는 이름을 가진 Logical Volume에 세팅</b>한다면, 다음과 같이 코드가 작성되어야 합니다.

{{< image src="02_consdandfield_complete.png" width=80% >}}

여기서 중간 점검을 하는 이유는, <b><font color=red>다음 내용부터는 작성하는 파일이 달라지기 때문</font></b>입니다. 놓치지 말고 잘 따라오세요.

---

## Event가 끝날 때 Hit 확인

이제 마지막 단계입니다. 앞서 두 단계를 통해 Geant4는 알아서 매 Event마다 <b>Hit을 생성하고 이를 HitsCollection에 담아 HCofThisEvent로 묶어서 가지고 있을 것</b>입니다. Event가 끝날 때 사용자가 이 Hit을 꺼내서 확인하지 않으면, 그 정보들은 그대로 사라집니다. 메모리를 날려버리고 새로운 다음 Event에 대한 정보를 기록하지요.

사용자가 할 일은 <b>Event가 끝날 때마다</b> Hit을 가져와서 확인하는 것입니다.

Geant4는 <b>매 Event마다 특정 행동을 반복적으로 수행하는 용도로 활용</b>할 수 있게끔 하기 위해, <b>EventAction</b>이라는 개념을 제공하고 있습니다. 이 시리즈에서는 <b>EventAction.cc라는 파일</b>을 열어서 이용하시면 됩니다. 여기에는 BeginOfEventAction()이라는 함수와 EndOfEventAction()이라는 함수가 있는데, 이름 그대로 매 Event가 시작되기 직전과 끝난 직후에 해당 함수가 실행되는 식으로 동작합니다. 즉, 우리처럼 <b>매 Event가 끝날 때마다 무언가를 하고 싶다면 EndOfEventAction() 함수 안에 할 일을 적으면 되는 것</b>이죠.

{{< admonition note >}}

엄밀히 말하면, G4UserEventAction 클래스를 상속 받아서 사용자만의 고유한 EventAction클래스를 만들고, 이 클래스의 함수 중 BeginOfEventAction() 함수나 EndOfEventAction() 함수를 overriding하여 작성하면 그 내용이 매 Event가 시작되기 직전과 끝난 직후에 각각 실행됩니다.

{{< /admonition >}}

EventAction.cc 파일을 열어보시면 아래쪽에 <b>EndOfEventAction() 함수</b>가 있을 것입니다. 이 함수 안에 내용을 작성할 것입니다.

{{< image src="03_EOE.png" width=100% >}}

이미 다음과 같은 내용이 작성되어 있네요.

```cpp
auto HCE = anEvent->GetHCofThisEvent();
if (!HCE)
	return;
```

의미는 그냥 써있는 그대로 읽으시면 됩니다. 한글로 쓰자면 다음과 같습니다.

- 이번 Event에서 만들어진 HCofThisEvent를 가져와서 HCE라는 변수로 지정
- 만약 HCE가 유효하지 않다면
  - EndOfEventAction() 함수를 종료

~~어때요, 참 쉽죠?~~

HCE 변수가 유효하지 않다면 if 조건문에 의해 함수가 종료되어 버리므로, <b>이 내용 아래 부분에 있는 내용은 반드시 HCE가 유효한 경우에만 실행될 것</b>입니다.

이제 HCofThisEvent로부터 Hit까지 가보도록 합시다.

### HCofThisEvent에서 HC 꺼내기

HCofThisEvent는 HitsCollectoin들의 묶음이라고 하였습니다. 이 때 Geant4는 수많은 HC들을 쉽게 구분하기 위해 <b>HC마다 0 이상의 양의 정수값으로 된 고유의 ID번호를 부여</b>합니다. 다만, 사용자가 이 정수값을 직접 기억할 필요는 없습니다. 사용자는 <font color=red><b>HC의 이름</b></font>을 이용하여 이 ID번호를 찾아올 수 있기 때문입니다. 

여기서 HC의 이름은 <b>Sensitive Detector를 설계할 때 결정</b>됩니다. 우리가 했던 것처럼 MFD와 PS를 이용할 경우에는, HC의 이름이 `{MFD의 이름}/{PS의 이름}`으로 결정됩니다. (대소문자 구분)

이 글에서 예시로 든 것처럼 다음과 같이 SD를 설계하였다면, <b><font color=red>HC의 이름은 "Detector/EDep"</font></b>이 되는 것입니다.

{{< image src="02_consdandfield_complete.png" width=80% >}}

사용자는 이 HC의 이름만 있으면, G4SDManager로부터 GetCollectionID() 함수를 이용해 해당 HC의 고유 ID번호를 가져올 수 있습니다. 이는 다음의 코드 두 줄로 수행할 수 있습니다.

```cpp
if(fHCID == -1)
	fHCID = G4SDManager::GetSDMpointer()->GetCollectionID("Detector/EDep");
```

{{< admonition note >}}

```cpp
G4int fHCID = G4SDManager::GetSDMpointer()->GetCollectionID("Detector/EDep");
```

이렇게 한 줄로 해도 될 일을 왜 굳이 if문으로 저런 이상한 조건을 붙이는 지 궁금한 분이 있으실 것입니다.

GetCollectionID() 함수는 생각보다 시간을 많이 잡아먹는 느린 함수입니다. 이런 함수를 매 Event가 종료될 때마다 실행하도록 하면 그만큼 시뮬레이션에 소요되는 시간이 길어지겠지요.

이런 문제를 해결하고자, 맨 처음에만 HC의 ID를 찾아오고 그 이후에는 전에 찾아온 값을 재활용하기 위해 이와 같이 코드를 작성하여 이용하는 것입니다.

{{< /admonition >}}

이어서, 이 ID를 이용하여 HCofThisEvent로부터 HC를 꺼내옵니다.

```cpp
auto hitsMap = static_cast<G4THitsMap<G4double> *>(HCE->GetHC(fHCID));
```

이상한 문구가 너무 많이 있어서 생소하실 수 있겠지만, 해석해보면 간단합니다.

- HCE->GetHC(fHCID)

  HCE(HCofThisEvent)로부터 fHCID라는 ID를 가진 HC를 가져옴

- static_cast<G4THitsMap<G4double> *>(HCE->GetHC(fHCID))

  앞서 가져온 HC를 `G4THitsMap<G4double> *` 자료형으로 형변환함

- auto hitsMap = static_cast<G4THitsMap<G4double> *>(HCE->GetHC(fHCID));

  이걸 hitsMap이라는 변수명으로 저장

이제 모르는 내용은 `G4THitsMap<G4double> *`이라는 처음보는 자료형 뿐이군요. 이는 HitsCollection의 종류 중 하나입니다. [이전 글]({{< ref "g4-noqasked-010-scoringtheory/#ps-hit-hc에-대한-상세-설명" >}})에서 Hit을 저장하는 방법이 여러가지가 있지만, PS를 이용하는 경우에는 <b>값을 누적</b>하여 <b><font color=blue>하나의 값</font></b>으로 저장하며, 이를 <b><font color=red>Copy Number라는 사물함 번호로 분류</font></b>하여 저장한다고 했었지요.

C++에서 이처럼 사물함 번호마다 값을 분류하여 저장하는 데이터 저장 방식의 대표적인 예로 <b>Map</b>이 있습니다. 그래서 Geant4에서는 이 Map이라는 구조를 활용하여 Hit을 저장하기 위한 Map이라는 이름으로 G4THitsMap이라는 클래스를 사용하고 있으며, 그 Map에 저장될 데이터가 G4double(실수)형이라는 것을 명시하기 위해 `G4THitsMap<G4double>`과 같이 작성하게 됩니다. 끝의 `*`는 이 자료형의 포인터형이라는 뜻입니다. 

<u>이 설명을 잘 모르겠으면 그냥 넘어가시고, 나중에 C++ 공부를 좀 더 한 뒤에 이해하셔도 됩니다.</u> 핵심은 다음의 두 가지입니다. 이거만 기억하셔도 충분합니다.

1. ```cpp
   auto hitsMap = static_cast<G4THitsMap<G4double> *>(HCE->GetHC(fHCID));
   ```

   라고 쓰면, hitsMap이라는 변수명으로 HitsCollection을 가져올 수 있음

2. 이 hitsMap에는 <b><font color=red>Copy Number라는 사물함 번호</font></b>마다, <b><font color=blue>PS가 누적해서 기록한 값</font></b>이 저장되어 있음

### HC에서 Hit 꺼내기

앞서 가져온 HitsCollection에는 PS가 기록한 값이 Copy Number라는 번호로 분류된 사물함마다 저장되어 있을 것입니다.

어떤 사용자는 Sensitive Detector를 딱 하나의 지오메트리에만 달았을 수도 있고, 어떤 사용자는 여러 개의 지오메트리에 달았을 수도 있습니다. 게다가, 이 Event에서 입자들이 그 지오메트리들을 아예 안지나갔을 수도 있고(Hit이 0개), 모두 다 지나갔을 수도 있습니다.

이런 이유때문에, PS를 이용하여 설계한 SD를 이용한 경우에는 <b>HitsCollection 안에 몇 개의 Hit이 들어있을지 아무도 모릅니다</b>. 이런 모든 경우를 다 아우르기 위해, <b>HC안에 들어있는 Hit을 모두 다 훑으며 확인하는 방식을 이용</b>합니다. 이는 C++에서 제공하는 for-each 반복문을 사용하면 쉽게 해결됩니다.

```cpp
for (const auto &iter : *(hitsMap->GetMap()))
{
	// ...
}
```

위와 같이 작성하면, hitsMap 안에 있는 <b>모든 사물함</b>들을 <b>iter</b>라는 변수명으로 접근할 수 있게 됩니다. 이 때 `iter.first`는 <b><font color=red>사물함 번호</font></b>가 되고, `*(iter.second)`는 <b><font color=blue>그 사물함 안에 들어있는 hit의 누적 값</font></b>이 됩니다.

예를 들어, G4PSEnergyDeposit을 통해 기록된 deposit된 에너지의 총합을 살펴보고, 이 값이 0보다 큰 경우 터미널 화면에 출력하고자 한다면 다음과 같이 코드를 작성합니다.

```cpp
for (const auto &iter : *(hitsMap->GetMap()))
{
    auto eDep = *(iter.second);
    if (eDep > 0.)
    {
    	G4cout << "--- Energy Deposit:" << eDep / MeV << G4endl;
    }
}
```

{{< admonition note >}}

`G4cout`과 `G4endl`은 각각 `std::cout`과 `std::endl`과 동일하다고 생각하셔도 무방합니다.

{{< /admonition >}}

해석하자면 다음과 같이 되겠군요

- hitsMap에 있는 사물함 각각을 iter라는 변수로 지정하여 반복문을 수행
  - 사물함 안에 있는 값(`*(iter.second)`)을 eDep이라는 변수명으로 저장
  - 만약 eDep의 값이 0보다 크다면
    - 화면에 "--- Energy Deposit: "과 "eDep 값을 MeV로 나눈 값"을 이어서 출력하고 줄바꿈

이런 방법을 통해 PS가 저장한 값을 Event가 끝날 때 가져와서 확인할 수 있게 됩니다. 지금까지 수행한 내용을 모두 작성하여 코드로 살펴보면 다음과 같습니다.

{{< image src="04_EOE_complete.png" width=90% >}}

---

## 최종 파일 다운받는 법

이번 글에서 작성한 코드는 [이 링크](https://github.com/evandde/g4_minimal/archive/e14a65ec75c34ff35956cddada381d46d0802cbd.zip)를 통해 다운받을 수 있습니다.

혹은 git repository를 clone하신 분의 경우에는, example branch의 이전 커밋 중 V3 scoring이라는 커밋을 참고하셔도 됩니다.

---



## 정리

스코어링이 사실 쉽지 않습니다. 저도 여러 사람들에게 강의를 수 차례 해보았지만, 제일 어려워하시는 부분이 스코어링입니다. C++의 문법을 모르면 생소한 코드가 너무 많아서 더욱 어려워보이는 것 같기도 합니다.

어떻게 하면 더 쉽게 전달할 수 있을까 많이 고민해 보았습니다만, 아직도 쉬워보이지는 않네요 :(far fa-frown):

스코어링 이론을 잘 숙지하고 있으시다면, 몇 번만 직접 구현해서 활용해보면 금방 터득하실 수 있으리라 생각합니다.

이제 다음 글이 이 시리즈의 마지막입니다. 다음 글에서는 스코어링 결과를 파일로 출력하는 법에 대해 알아보겠습니다.

