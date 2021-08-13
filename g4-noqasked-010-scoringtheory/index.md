# Geant4 무작정 따라하기 - 10. 스코어링 이론


Geant4 무작정 따라하기 시리즈의 열번째. Geant4 시뮬레이션에서 원하는 물리량을 기록하는 스코어링에 대해 알아봅니다.

<!--more-->

이 글에서는 Geant4에서 스코어링 시스템의 기본적인 동작 이론에 대해 설명할 것입니다. 이를 바탕으로 다음 글에서 이어질 Geant4에서 기본적으로 제공하는 스코어러의 사용에 있어 이해도를 높이는 것이 이번 글의 목적입니다. 더 나아가, 이 개념을 잘 이해하시고 충분한 C++ 언어 지식을 갖추신다면 Geant4에서 기본 제공하는 스코어러를 넘어 여러분만의 스코어러를 직접 구현하여 이용할 수도 있을 것입니다.

---

## Geant4의 스코어링 용어

Geant4는 모든 구조물 내에서 방사선 수송에 필요한 물리량 전반을 다 계산하며 시뮬레이션을 돌립니다. 이 수많은 값들을 우리에게 모조리 알려주는 방식이 이전에 설명한 바 있는 [verbose]({{< ref "g4-noqasked-007-trkvb" >}})입니다.

하지만 우리는 이 모든 값이 다 필요한 것이 아닙니다. 이 중에 원하는 부분만 추려서 기록하면 좋겠지요. 이러한 작업을 **스코어링**이라고 합니다. 즉, 스코어링이란 <font color=red><b>관심 있는 지오메트리 내</b></font>에서 <font color=blue><b>관심 있는 물리량</b></font>이 **어떠한 값을 가지는지**를 살펴보는 것입니다.

### 관심 있는 지오메트리

사용자가 만든 다양한 지오메트리 중, 스코어링을 수행하고 싶은 <b><font color=red>관심 있는 지오메트리(들)</font></b>이 있을 것입니다. 이 지오메트리(들)의 <b><font color=red>Logical Volume</font></b>에 <b>Sensitive Detector를 세팅</b>해줌으로써, 해당 지오메트리 내에서의 일을 스코어링하도록 프로그램에게 지시할 수 있습니다.

여기서 <b>Sensitive Detector</b>, 줄여서 <b>SD</b>는, <b><font color=blue>관심 있는 물리량</font></b>을 어떤 조건 하에서 어떻게 가공하여 메모리 공간에 저장할 것인지와 같은 <b>스코어링 방법을 정의하는 클래스</b>입니다.

### 관심 있는 물리량

사용자는 <b><font color=red>해당 지오메트리</font></b>에 <b><font color=blue>전달된 에너지</font></b>에 관심이 있을 수도 있고, <b><font color=blue>반응 위치에 관심</font></b>이 있을 수도 있으며, <b><font color=blue>반응 위치와 해당 위치에 전달된 에너지를 한 세트로 묶어서</font></b> 살펴보고 싶을 수도 있습니다. 이처럼 **관심 있는 물리량** 혹은 그 **물리량들을 조합한 한 세트**를 Geant4에서는 <b><font color=blue>Hit</font></b>이라는 클래스를 통해 관리합니다. 즉, **Hit 하나**당 **한 세트의 정보**가 된다고 보시면 됩니다.

만약 여러 종류의 정보를 따로 관리하고 싶다면, 여러 종류의 Hit을 사용하면 됩니다. 예를 들어, 어떤 조건 하에서는 전달된 에너지만 기록하고 싶고, 또 다른 조건 하에서는 반응 위치만 기록하고 싶다면, <b>전달된 에너지라는 Hit</b>과 <b>반응 위치라는 Hit</b>으로 분리하여 두 종류의 Hit을 이용할 수 있습니다. 이는 반응 위치와 그 위치에 전달된 에너지를 한 세트로 묶은 Hit과는 다른 개념인 것입니다.

Geant4는 <b>같은 종류의 Hit들을 한 데 모아서 저장</b>하는 <b>HitsCollection</b> 이라는 클래스도 제공하고 있습니다. 이는 간단히 말해 <b>Hit을 담는 주머니</b>라고 생각하면 됩니다. 하나의 HitsCollection에는 같은 종류의 Hit들만 들어가기 때문에, 예를 들어 전달된 에너지 Hit은 전달된 에너지 HitsCollection에 담기게 되고, 반응 위치 Hit은 반응 위치 HitsCollection에 담기는 식입니다.



---

## Geant4의 스코어링 개념

### 기본 원리

스코어링은 기본적으로 **Event 단위**로 이루어지며, 다음 과정이 매 Event마다 반복됩니다.

1. 입자를 수송하던 중, 입자가 <b><font color=red>SD가 세팅된 지오메트리</font></b> 내에 들어오는 순간부터, 해당 SD가 일을 하기 시작합니다.
2. SD는 구현된 내용에 따라, <b><font color=blue>매 Step마다 관심 있는 물리량 정보를 수집하여 Hit을 생성</font></b>합니다. 생성된 Hit은 각 종류별로 상응하는 HitsCollection에 저장됩니다.
3. Geant4는 매 Event가 끝날 때마다, 해당 Event에서 만들어진 HitsCollection들을 한 데 묶어 **HCofThisEvent**라는 형태로 제공합니다. 사용자는 이 HCofThisEvent로부터 원하는 종류의 HitsCollection을 가져온 뒤, 그 안에 저장된 Hit들을 확인하고 기록할 수 있습니다.

그림으로 나타내면 다음과 같습니다.

{{< image src=01_Scoring.png width=100% >}}

### Sensitive Detector 설계방법

Sensitive Detector를 설계하는 방법은 크게 다음의 두 가지가 있습니다만, 여기서는 <b>1번 방법</b>만 다루겠습니다.

1. <b>Multi Functional Detector</b>에 사용자가 원하는 <b>Primitive Scorer들을 Register</b>하여 설계

2. G4VSensitiveDetector 클래스를 상속받아 사용자가 직접 Sensitive Detector를 구현. 경우에 따라 Hit과 HitsCollection 수준부터 직접 구현하여 이용하기도 함.

Multi Functional Detector(MFD)는 일종의 틀로 보시면 되고, 이 틀에 실질적인 기능을 가진 Primitive Scorer(PS)를 조립해 넣는 식으로 SD를 구현합니다. 일종의 모듈형 시스템[^1]처럼 조립된 전체가 하나의 SD가 되는 방식입니다. Geant4가 제공하는 PS들 중 일부를 소개해 드리겠습니다. (10.7 버전 기준)

- G4PSCellCharge: 해당 지오메트리 내에 deposit된 charge의 총합을 스코어링
- G4PSCellFlux: 해당 지오메트리 내의 플럭스를 스코어링 (트랙길이 / 부피 방식으로 계산)
- G4PSDoseDeposit: 해당 지오메트리 내에서의 흡수선량(absorbed dose)을 스코어링
- G4PSEnergyDeposit: 해당 지오메트리 내에 deposit된 에너지의 총합을 스코어링
- G4PSNofCollision: 해당 지오메트리에 입사한 입자의 개수를 스코어링
- G4PSPassageCellCurrent[^2]: 해당 지오메트리를 지나쳐간(입사 후 빠져나간) track의 수를 스코어링
- G4PSPassageCellFlux: 해당 지오메트리를 지나쳐간(입사 후 빠져나간) track의 플럭스를 스코어링 (트랙길이 / 부피 방식으로 계산)
- G4PSPopulation[^3]: 해당 지오메트리에 들어온 입자의 수를 스코어링
- G4PSTermination: 해당 지오메트리 내에서 종료[^4]된 track의 수를 스코어링

이 외에도 더 많은 PS가 존재합니다. 그리고 이름 끝에 3D가 붙은 PS도 있는데, 이는 3D가 없는 것과 기능이 동일하며 해당 물리량을 복셀화된 각 볼륨마다 따로 저장하여 3D 분포를 살펴보는 데에 활용 가능합니다. (e.g. G4PSCellCharge3D)

추가적으로, **필터**를 활용하면 **특정 조건 하에서만 스코어링**이 이루어지도록 할 수도 있습니다. 예를 들어, G4PSCellFlux를 사용하는데 여기에 입자 제한 필터로 Gamma만 스코어링하도록 제한하면, 해당 지오메트리 내에서 Gamma 입자의 플럭스만 스코어링할 수 있는 것입니다. 다만, <b>하나의 PS당 하나의 필터만 세팅</b>할 수 있습니다. 필터의 종류는 다음과 같습니다. (10.7 버전 기준)

- G4SDChargedFillter: (+) 혹은 (-) 전하를 가진 입자만 스코어링하도록 제한
- G4SDNeutralFilter: 전하가 없는 중성 입자만 스코어링하도록 제한
- G4SDKineticEnergyFilter: 입자의 운동에너지가 일정 범위(하한~상한) 내에 들어오는 경우에만 스코어링하도록 제한
- G4SDParticleFilter: 입자의 이름을 이용하여, 그 입자만 스코어링하도록 제한 (여러 종류의 입자도 가능)
- G4SDParticleWithEnergyFilter: 입자의 이름과 운동에너지 범위를 이용하여, 그 입자의 운동에너지가 일정 범위(하한~상한) 내에 들어오는 경우에만 스코어링하도록 제한 (한 종류의 입자만 가능)

---

## PS, Hit, HC에 대한 상세 설명

### PS와 HC의 관계

결국 Primitive Scorer(PS)가 실질적으로 <b><font color=blue>물리량(Hit)</font></b>을 검출하는 기능을 가집니다. 그리고 PS가 검출한 물리량(Hit)들은 앞서 설명하였던 **HitsCollection**에 담기게 될 것입니다.

이 때, PS마다 스코어링하는 물리량의 종류가 다르므로 <b><u>PS마다 각각 HitsCollection을 하나씩 담당</u></b>하게 되는 것입니다. 각 PS가 담당하여 맡고 있는 HitsCollection에, 스코어링을 통해 검출해낸 Hit들을 저장하는 방식이 되는 것이지요.

### HC에 Hit을 저장하는 방법

Hit은 스코어링 조건에만 부합하는 상황이라면 일단 매 Step마다 생성됩니다. 이렇게 생성되는 수 많은 Hit들은 HitsCollection(HC)에 저장되지요. PS를 이용하는 경우에는 Hit이 HC에 담길 때 **누적**하는 방식으로 저장됩니다. 예를 들어, G4PSDoseDeposit의 경우에는 스코어링 된 흡수선량을 계속 더해서, 최종적으로 **총 흡수선량의 합**이라는 하나의 값만 남는 것이죠.

### 여러 지오메트리끼리의 구분

[이전 글]({{< ref "g4-noqasked-002-detcon/#응용" >}})에서 Geant4에서는 지오메트리를 Solid, Logical, Physical로 나누어 관리하기 때문에, Logical Volume을 하나만 만들고 이를 공유하여 Physical Volume을 여러 개 둘 수 있다고 하였습니다. 이런 경우, <b>SD는 Logical Volume에 세팅</b>하므로 <b>여러 개의 지오메트리에 동일한 SD가 세팅</b> 될 것입니다.

이처럼 여러 개의 Physical Volume으로 정의된 지오메트리는 실제로도 각각 서로 다른 지오메트리이므로, <b>각자의 스코어링 결과를 구분하여 기록</b>하고 싶은 경우가 많을 것입니다. 이를 위해 Geant4는 HC에 Hit을 저장할 때 <b>지오메트리 별로 구분하여 누적하는 방식을 채택</b>하였습니다. 

여기서 각각의 지오메트리를 구분하는 구분자가 바로 **Copy Number**입니다. 이전에 Physical Volume에 대한 설명을 하던 [이 글]({{< ref "g4-noqasked-006-phyvol/#copy-number" >}})에서 Copy Number는 스코어링 결과를 따로따로 보관하기 위한 **사물함 번호**라는 설명을 했었지요. 즉, G4PSDoseDeposit이 세팅된 Logical Volume을 공유하여 여러 개의 Physical Volume이 배치되었다면, Copy Number가 0번인 Physical Volume에서 스코어링 된 흡수선량은 0번 사물함에 누적되고, Copy Number가 1번인 Physical Volume에서 스코어링 된 흡수선량은 1번 사물함에 누적되는 식입니다. 최종적으로 사용자는 각 Copy Number에 상응하는 사물함에서 누적된 총 합을 확인함으로써 각 지오메트리 별로 구분할 수 있게 됩니다.



---



## 정리

위 내용을 다이어그램으로 요약해보면 다음과 같습니다.

{{< mermaid >}}
graph LR
    subgraph Sensitive Detector
    C & D --> B
    E --- C
    F --- D
    end
B ==> A
A[Logical Volume]
B[Multi Functional Detector]
C[Primitive Scorer 1]
D[Primitive Scorer 2]
E[Filter 1]
F[Filter 2]
{{< /mermaid >}}

{{< mermaid >}}
graph BT
A --> B
C --> D
B & D --> E === F
A[1번에서 스코어링된 Hit]
B[1번 사물함]
C[2번에서 스코어링된 Hit]
D[2번 사물함]
E[HitsCollection]
F[Primitive Scorer]
{{< /mermaid >}}



Geant4에서의 스코어링에 대한 큰 개념은 이것으로 끝입니다. 새로운 용어와 개념이 너무 많아, 처음 보면 어려울 수 있습니다. 맨 마지막에 보여드린 다이어그램만 대강 이해하셔도 괜찮습니다. 일단 사용하다보면 익숙해지기 마련이니까요.

다음 글에서는 이 이론을 바탕으로 스코어링을 직접 구현해보도록 하겠습니다.



---

[^1]: 여러 개의 기능적 구성요소(모듈)들을 조합하여 하나의 시스템으로 완성되는 구조.
[^2]: Passage 유형은 해당 지오메트리를 빠져나갔던 track 다시 들어와서 또 빠져나가면 count가 추가됨.
[^3]: Population 유형은 해당 지오메트리에 처음으로 들어올 때에만 count가 추가됨. 나갔다 다시 들어오면 무시.
[^4]: 흡수되거나 운동에너지가 0이 되는 등의 이유로 멈춘 것. 엄밀히는 *fStopAndKill* 상태가 된 track을 의미함.

