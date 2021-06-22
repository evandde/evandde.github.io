# Geant4 무작정 따라하기 - 8. 선원항 정의하기


Geant4 무작정 따라하기 시리즈의 여덟번째. Event와 Run의 개념을 이해하고, Event의 시작에 해당하는 선원항을 정의하는 방법에 대해 알아봅니다.

<!--more-->

## Event & Run

### Event

입자 수송해석을 위한 몬테칼로 시뮬레이션이라 하면 일반적으로 **방사선원이나 발생장치로부터 입자가 발생되는 시점부터 그 입자로 인해 야기된 여러 반응들을 모니터링하는 일련의 과정**을 <font color='red'><b>반복적으로 시행</b></font>하는 것을 의미하지요.

이렇게 반복적으로 시행되는 **일련의 과정 1회**를 Geant4에서는 **Event**라고 합니다. 다시 말해 **Event**란, 초기 입자(Primary particle)가 발생하여 이로부터 파생되는 이차 입자들(Secondary particles)까지의 수송 과정을 의미하는 것입니다.

### Run

몬테칼로 시뮬레이션에서 "**시뮬레이션을 한 회 수행한다**"는 표현은 일반적으로 **한 세트의 반복시행작업을 전부 끝냈음**을 의미할 것입니다. 

Geant4에서는 **시뮬레이션 한 회**를 **Run**이라고 합니다. 즉, 여러 개의 Event를 반복하는 싸이클을 한데 묶어 Run이라고 부르는 것이지요.

### Run을 실행하는 법

앞서 글에서 살펴봤던 `run.mac`파일을 보시면, 마지막 줄에 `/run/beamOn 100`이라는 내용이 있습니다. 이 줄이 바로 Run을 실행하는 명령줄입니다. `/run/beamOn`은 Geant4 프로그램이 입자 수송을 시작하도록 하는 명령어로, 뒤에 정수 인자를 받아 이 **정수 값만큼 Event를 반복시행**하여 **하나의 Run을 구성**하도록 합니다.

{{< admonition note >}}

필요에 따라, 이 줄을 여러 회 입력하여 여러 개의 Run이 순차적으로 실행되게끔 할 수도 있습니다.

{{< /admonition >}}

---

## 코드 작성 위치

지오메트리를 정의할 때와 마찬가지로, Geant4 코드 작성 시 초기 입자에 대한 내용을 적는 곳도 정해져 있습니다.

G4VUserPrimaryGeneratorAction 클래스를 상속받아 만드는 UserClass에 적어야 하며, 이 중에서도 void GeneratePrimaries(G4Event*) 함수가 매 Event마다 초기 입자를 발생시키는 역할을 담당합니다.

제가 제공해드린 템플릿 코드의 **src 디렉토리** 내부에 <b>PrimaryGeneratorAction.cc</b>라는 파일이 있을 것입니다. 이 파일을 열면 다음과 같은 코드가 나옵니다.

{{< image src="01_prigen.png" width=100% >}}

여기서 16번째 줄부터 나오는 <b>void PrimaryGeneratorAction::GeneratePrimaries(G4Event *anEvent)</b> 함수 안에 초기 입자에 대한 내용을 적으면 됩니다.

{{< admonition note >}}

엄밀히 말하면, Event마다 바뀌는 설정값은 이 함수 안에 적고, 바뀌지 않는 설정값은 생성자에 적는 것이 연산효율측면에서 이득이 있습니다.

다만, 이 시리즈에서는 설명과 이해의 용이성을 위해 그냥 GeneratePrimaries 함수 안에 모두 작성하도록 하겠습니다.

{{< /admonition >}}

GeneratePrimaries 함수 안에는 다음과 같은 줄이 이미 작성되어 있습니다.

```cpp
fPrimary->GeneratePrimaryVertex(anEvent);
```

여기서 fPrimary 변수는 **초기 입자에 대한 설정을 담당**하는 클래스인 **G4ParticleGun** 클래스 객체의 포인터입니다.

이 클래스는 **GeneratePrimaryVertex라는 함수**를 갖고 있습니다. 이 함수는 "**초기 입자를 발생시켜서 Event를 한 회 수행하라**"는 기능을 가진 함수입니다. 즉 위의 코드 한 줄에 의해 **초기 입자가 발생**되는 것이지요.

우리가 할 일은, "<b>초기 입자를 발생시키기 <font color='red'>전</font>에 초기 입자의 특성을 설정</b>"하는 것입니다. 그래서, 우리가 쓸 내용은 전부 `fPrimary->GeneratePrimaryVertex(anEvent);` 줄보다 <font color='red'><b>위쪽에 위치</b></font>해야 합니다.

---

## G4ParticleGun

fPrimary 변수는 G4ParticleGun 클래스 객체의 포인터라고 하였습니다. 이 클래스에서 초기 입자의 특성을 설정하기 위해 제공하는 함수 중 대표적으로 몇 가지를 알아봅시다.

### 입자의 종류

입자의 종류를 설정하기 위한 함수로, SetParticleDefinition이라는 함수를 제공합니다. 원형은 다음과 같습니다.

```cpp
void SetParticleDefinition(G4ParticleDefinition* aParticleDefinition)
```

G4ParticleDefinition이라는 클래스가 생소하실텐데요, Geant4에서 입자에 대한 정의를 담당하는 클래스라고만 해두고 넘어가겠습니다.

Geant4가 기본적으로 지원하는 입자의 모든 종류는 [Geant4 Doxygen](https://geant4.kek.jp/Reference/)에서 G4ParticleDefinition 클래스의 레퍼런스 페이지([10.7.p01 버전](https://geant4.kek.jp/Reference/10.07.p01/classG4ParticleDefinition.html))에 들어가면 상속받은 클래스 목록(*Inheritance diagram for G4VSolid*)에서 확인할 수 있습니다.

{{< admonition note >}}

모든 입자를 초기 입자로 사용할 수 있는 것은 아닙니다. 일부 입자는 초기 입자로 설정하는 것이 불가능한 경우도 있습니다.

{{< /admonition >}}

{{< admonition note >}}

사실, Geant4 프로그램에서 사용 가능한 입자는 그 프로그램에서 어떤 PhysicsLists를 사용하느냐에 따라 좌우됩니다. 하지만 이 시리즈에서는 PhysicsLists를 아예 다루지 않을 예정이므로, 그냥 넘어가도록 하겠습니다.

참고로 `g4_minimal` 템플릿 코드는 QBBC 물리모델을 사용하고 있습니다.

{{< /admonition >}}

여기서는 대표적으로 몇 가지 입자만 언급하도록 하겠습니다.

- Geantino, Charged Geantino

  각각 G4Geantino 클래스, G4ChargedGeantino 클래스를 통해 이용할 수 있습니다.

  Geantino란 Geant4에서 정의한 가상의 입자로, 질량/스핀/parity가 0이며 어떠한 반응도 일으키지 않는 중성 입자입니다.

  Charged Geantino는 Geantino와 기본적인 특성은 동일하나, 전하만 +1인 입자입니다.

  이 두 가지 입자는 시뮬레이션의 검증단계에서 주로 활용됩니다.

- Gamma

  G4Gamma 클래스를 통해 이용할 수 있습니다. 일반적으로 알려진 광자(Photon)에 해당합니다.

- Electron, Positron

  각각 G4Electron 클래스, G4Positron 클래스를 통해 이용할 수 있습니다. 일반적으로 알려진 전자(Electron)와 양전자(Positron)에 해당합니다.

- Proton

  G4Proton 클래스를 통해 이용 가능합니다. 일반적으로 알려진 양성자(Proton)에 해당합니다.

- Neutron

  G4Neutron 클래스를 통해 이용 가능합니다. 일반적으로 알려진 중성자(Neutron)에 해당합니다.

- Muon, Antimuon

  각각 G4MuonMinus 클래스, G4MuonPlus 클래스를 통해 이용 가능합니다. 일반적으로 알려진 뮤온(Muon)과 반뮤온(Antimuon)에 해당합니다.

모든 입자 클래스들은 **각 입자의 ParticleDefinition 클래스 객체의 포인터를 반환하는 static 함수**인 <b>Definition() 함수를 제공</b>합니다. 즉, 어느 입자를 사용하든 `클래스명::Definition()`이라고 입력하여 그 입자의 ParticleDefinition을 가져올 수 있습니다. 예를 들어 G4Gamma 클래스라면, `G4Gamma::Definition()`과 같이 말이죠.

여러가지 입자를 알아보았으니, 이들을 초기 입자로 설정하는 방법을 살펴봅시다. 다음의 두 단계를 거치면 됩니다.

1. 해당 입자의 클래스 헤더를 포함시킴
2. SetParticleDefinition 함수를 이용하여 해당 입자를 초기 입자로 설정

앞서 말씀드린 것처럼, SetParticleDefinition 함수는 `fPrimary->GeneratePrimaryVertex(anEvent);` 줄보다 <font color='red'><b>위쪽에 위치</b></font>하도록 작성해야 한다는 점에 주의하세요.

예를 들어 Gamma를 초기 입자로 설정하고 싶다면, 다음과 같이 입력하면 됩니다. 

{{< highlight cpp "linenos=false,hl_lines=1 5" >}}
#include "G4Gamma.hh" // Include header for G4Gamma class
// ...    
void PrimaryGeneratorAction::GeneratePrimaries(G4Event *anEvent)
{
    fPrimary->SetParticle(G4Gamma::Definition()); // Set primary as gamma    

    fPrimary->GeneratePrimaryVertex(anEvent);
}
{{< / highlight >}}

실제 코드는 다음과 같습니다.

{{< image src="02_setparticledefinition.png" width=100% >}}

이렇게 변경한 뒤, Tracking Verbose를 1레벨로 하여 출력해보면 다음과 같이 초기 입자가 바뀐 것을 확인할 수 있습니다.

{{< image src="03_setparticledefinitionrslt.png" width=100% >}}



### 입자의 운동에너지

입자의 운동에너지를 설정하기 위한 함수로, SetParticleEnergy라는 함수를 제공합니다. 원형은 다음과 같습니다.

```cpp
void SetParticleEnergy(G4double aKineticEnergy)
```

입력 인자는 간단하게 G4double형입니다. 다만, 에너지에 대한 **단위를 입력**할 필요가 있으므로, **G4SystemOfUnits 헤더를 포함**시켜줘야 한다는 점에 주의하세요.

예를 들어 초기 입자의 운동에너지를 0.662 MeV로 설정하고 싶다면, 다음과 같이 입력하면 됩니다.

{{< highlight cpp "linenos=false,hl_lines=1 6" >}}
#include "G4SystemOfUnits.hh" // Include header for unit system
// ...    
void PrimaryGeneratorAction::GeneratePrimaries(G4Event *anEvent)
{
    // ...
    fPrimary->SetParticleEnergy(0.662 * MeV);

    fPrimary->GeneratePrimaryVertex(anEvent);
}
{{< / highlight >}}

실제 코드는 다음과 같습니다.

{{< image src="04_setparticleenergy.png" width=100% >}}

이렇게 변경한 뒤, Tracking Verbose를 1레벨로 하여 출력해보면 다음과 같이 초기 입자의 운동에너지가 바뀐 것을 확인할 수 있습니다.

{{< image src="05_setparticleenergyrslt.png" width=100% >}}



### 입자의 위치

입자의 위치를 설정하기 위한 함수로, SetParticlePosition이라는 함수를 제공합니다. 원형은 다음과 같습니다.

```cpp
void SetParticlePosition(G4ThreeVector aPosition)
```

입력 인자는 G4ThreeVector 객체입니다.

예를 들어 초기 입자의 위치를 (0, 0, 0)으로 설정하고 싶다면, 다음과 같이 입력하면 됩니다.

{{< highlight cpp "linenos=false,hl_lines=5" >}}
// ...    
void PrimaryGeneratorAction::GeneratePrimaries(G4Event *anEvent)
{
    // ...
    fPrimary->SetParticlePosition(G4ThreeVector());

    fPrimary->GeneratePrimaryVertex(anEvent);
}
{{< / highlight >}}

실제 코드는 다음과 같습니다.

{{< image src="06_setparticleposition.png" width=100% >}}

이 부분은 원래 기본 값이 (0, 0, 0)이어서 바뀌지 않습니다만, 원하는 값으로 변경해보시면 Tracking Verbose에서 차이를 확인할 수 있을 것입니다.

{{< image src="07_setparticlepositionrslt.png" width=100% >}}


### 입자의 운동방향

입자의 운동방향을 설정하기 위한 함수로, SetParticleMomentumDirection이라는 함수를 제공합니다. 원형은 다음과 같습니다.

```cpp
void SetParticleMomentumDirection(G4ParticleMomentum aMomDirection)
```

입력 인자는 G4ParticleMomentum라고 적혀있습니다만, 이는 사실 **G4ThreeVector의 다른 이름**일 뿐입니다. 위치 때와 동일하게 G4ThreeVector 객체를 넣으시면 됩니다.

예를 들어 초기 입자의 운동방향을 +Z축인 (0, 0, 1)으로 설정하고 싶다면, 다음과 같이 입력하면 됩니다.

{{< highlight cpp "linenos=false,hl_lines=5" >}}
// ...    
void PrimaryGeneratorAction::GeneratePrimaries(G4Event *anEvent)
{
    // ...
    fPrimary->SetParticleMomentumDirection(G4ThreeVector(0., 0., 1.));

    fPrimary->GeneratePrimaryVertex(anEvent);
}
{{< / highlight >}}

실제 코드는 다음과 같습니다.

{{< image src="08_setparticlemomentumdirection.png" width=100% >}}

이렇게 변경한 뒤, Tracking Verbose를 1레벨로 하여 출력해보면 다음과 같이 초기 입자의 진행 방향이 바뀐 것을 확인할 수 있습니다. 제가 보여드리는 예제 코드의 경우 +Z축 방향에 앞서 정의했던 phantom이 있다보니, 감마선이 이 지오메트리와 충돌하여 여러 반응이 일어나는 모습까지 확인이 되네요.

{{< image src="09_setparticlemomentumdirectionrslt.png" width=100% >}}

---

## UI로 확인해보기

지금까지 변경한 내용을 UI로 실행하면 그래픽으로 살펴볼 수도 있습니다. build 디렉토리에서 `./g4_minimal`을 입력하여 실행해서 UI창을 띄워봅니다. 다음 그림과 같이 Geometry가 보일 것입니다.

{{< image src="10_UI.png" width=100% >}}

여기서, 그림 하단에 빨간색으로 표시해 둔 **Session** 입력창에 `/run/beamOn 100`이라고 입력한 뒤 [Enter]를 누르면 UI 상에서 <b>Event 100개 묶음의 Run 한 번을 실행</b>시킬 수 있습니다.

{{< image src="11_UIrun.png" width=100% >}}

좀 확대해보시면 다음과 같은 모습을 확인할 수 있습니다. 

{{< image src="12_UIrunzoom.png" width=100% >}}

{{< admonition note >}}

그래픽에서 보이는 선이나 점의 색상은 `vis.mac` 등에서 설정한 값에 따라 달라질 수 있습니다.

{{< /admonition >}}

기본적으로는 다음과 같이 해석하시면 됩니다.

- 노란점: 입자를 수송하던 중, Track이 기록된 분절점의 위치
- 초록선: Charge가 중성인 입자의 궤적(이 예시에서는 Gamma 입자에 해당함)
- 빨간선: Charge가 음성(-)인 입자의 궤적(이 예시에서는 Electron 입자에 해당함)
- 파란선: Charge가 양성(+)인 입자의 궤적(이 예시에서는 나타나지 않음)

---

## 정리

이번 글에서는 초기 입자의 정보를 설정하고 확인하는 방법에 대해 살펴보았습니다. 그러나 이런식으로 입력하면, **항상 동일한 조건의 초기 입자만 발생**될 것입니다.

다음 글에서는 G4RandomTools 헤더를 활용하여, Event 마다 초기 입자의 위치나 방향을 변경하며 발생시키는 방법에 대해 알아보겠습니다.
