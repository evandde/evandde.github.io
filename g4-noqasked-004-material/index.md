# Geant4 무작정 따라하기 - 4. 물질 정의하기


Geant4 무작정 따라하기 시리즈의 네번째. 여러가지 물질을 정의하는 방법을 알아보고, 이를 이용하여 LogicalVolume을 정의해 봅니다.

<!--more-->

---

## Geant4의 물질

Geant4에서 물질은 다음의 계층을 따라 정의됩니다.

{{< mermaid >}}
graph LR
A --> B --> C --> C
A[Isotope]
B[Element]
C[Material]
{{< /mermaid >}}

Isotope를 조합하여 Element를 정의하고, Element를 조합하여 Material을 정의합니다. 또한, 여러 Material을 섞어서 새로운 Material을 만들 수도 있습니다.

하지만 Isotope, Element, Material 클래스에 대해 모든걸 설명하기에는 너무 글이 길어지므로, 여기서는 **Geant4에서 기본적으로 제공하는 물질 DB에서 원하는 물질을 가져와 사용하는 법**만 다루겠습니다.

## Geant4 material database

Geant4는 NIST(National Institute of Standards and Technology)의 [원자량 및 동위원소조성비 데이터](http://physics.nist.gov/PhysRefData/Compositions/index.html)를 바탕으로 제작해둔 물질 DB를 제공하고 있습니다. 

### 물질 목록 확인하기

Geant4가 제공하는 material database의 목록은 [이 링크](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Appendix/materialNames.html)에서 확인할 수 있습니다.

- [Simple Materials (Elements)](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Appendix/materialNames.html#simple-materials-elements)

  단일 원소로 구성된 물질의 목록

- [NIST Compounds](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Appendix/materialNames.html#nist-compounds)

  화합물의 목록. 표의 형태는 두가지로, 각각을 읽는 법은 다음과 같음

  - 조성비가 실수로 표시된 경우: 질량비

    {{< image src="01_g4matcompound.png" width=100% >}}

  - 조성비가 정수로 표시된 경우: 개수비

    {{< image src="02_g4matcompound.png" width=100% >}}

- [HEP and Nuclear Materials](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Appendix/materialNames.html#hep-and-nuclear-materials)

- [Space (ISS) Materials](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Appendix/materialNames.html#space-iss-materials)

- [Bio-Chemical Materials](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Appendix/materialNames.html#bio-chemical-materials)

  특정 분야에서 주로 사용되는 물질들의 목록. 읽는 법은 동일

이 중 대표적으로 많이 쓰이는 물질을 몇 개 소개하자면 다음과 같습니다.

- G4_AIR (공기)
- G4_Galactic (진공)
- G4_WATER (물)
- G4_STAINLESS-STEEL (SUS)
- G4_SODIUM_IODIDE (NaI)

이 외에도 다양한 물질이 있으니 찾아보시기 바랍니다.

### 목록에 있는 물질 정의하기

여러분이 원하는 물질을 위 목록에서 찾으셨다면, **G4NistManager**클래스의 **FindOrBuildMaterial() 함수**를 이용해 해당 물질을 정의할 수 있습니다. 이 함수의 원형은 다음과 같습니다.

```cpp
G4Material *FindOrBuildMaterial (const G4String &name, 
                                 G4bool isotopes=true, 
                                 G4bool warning=false)
```

- name: Geant4 Material Database에서 가져올 물질의 이름. 위 링크에서 확인한 물질의 이름을 **대소문자까지 맞추어 정확하게 입력**해야 함
- *isotopes: **입력하지 않아도 되는 인자**. 내부 소스코드를 뜯어보면, 사실 아예 이용되지 않는 변수임*
- *warning: **입력하지 않아도 되는 인자**. 물질 정의 작업이 정상적으로 이루어지지 않은 경우 경고문구를 띄울지 여부를 정의하는 인자. 기본값은 false*

예를 들어 NIST Compounds 목록에 있는 G4_AIR (공기)를 정의하고자 하는 경우에는 다음과 같이 입력합니다.

```cpp
auto matAir = G4NistManager::Instance()->FindOrBuildMaterial("G4_AIR");
```

여기서 G4NistManager::Instance() 부분은 G4NistManager 클래스의 객체를 호출해오는 명령어입니다. Geant4 물질 DB에서 물질을 가져와 정의할때마다 이 객체가 필요하기 때문에 매번 호출하기보다는, **이 객체를 따로 정의해두고 가져다 쓰는 방식을 주로 이용**합니다. 그러면 또다른 물질을 정의할 때에 G4NistManager 객체를 다시 호출하지 않아도 되기 때문입니다.

예를 들어 G4_AIR (공기)에 이어, G4_WATER (물)도 정의한다고 하면 다음과 같이 입력할 수 있습니다.

```cpp
auto nist = G4NistManager::Instance();
auto matAir = nist->FindOrBuildMaterial("G4_AIR");
auto matWater = nist->FindOrBuildMaterial("G4_WATER");
```

### NIST DB의 원소로 화합물 만들기

원하는 물질이 Geant4 물질 DB에 없을 수도 있습니다. 이런 경우, 여러분이 NIST DB의 원소를 조합하여 새로운 화합물을 정의할 수 있습니다. 이는 G4NistManager 클래스의 **ConstructNewMaterial() 함수**를 이용하면 됩니다. 함수의 원형은 다음의 두 가지 입니다.

```cpp
G4Material *ConstructNewMaterial (const G4String &name, 
                                  const std::vector< G4String > &elm, 
                                  const std::vector< G4int > &nbAtoms, 
                                  G4double dens, 
                                  G4bool isotopes=true, 
                                  G4State state=kStateSolid, 
                                  G4double temp=NTP_Temperature, 
                                  G4double pressure=CLHEP::STP_Pressure)
```

<b>조성비를 <font color = 'red'>개수비</font>로서 입력하고자 할 때 사용합니다.</b>

- name: 물질의 이름. 자유롭게 적으면 됨
- elm: 원소기호의 목록을 적은 G4String형 벡터. 화합물의 구성원소를 순서대로 적음
- nbAtoms: 원소별 조성비를 **개수비**형태로 적은 G4int형 벡터. 화합물의 구성원소별 조성비를 순서대로 적음
- dens: 물질의 밀도
- *isotopes: **입력하지 않아도 되는 인자**. 내부 소스코드를 뜯어보면, 사실 아예 이용되지 않는 변수임*
- *state: **입력하지 않아도 되는 인자**. 물질의 상을 특정하고 싶을 때 사용. 기본값은 kStateSolid(고체형)*
- *temp: **입력하지 않아도 되는 인자**. 물질의 온도를 특정하고 싶을 때 사용. 기본값은 NTP_Temperature(약 293.15 K)*
- *pressure: **입력하지 않아도 되는 인자**. 물질의 압력을 특정하고 싶을 때 사용. 기본값은 CLHEP::STP_Pressure(1 atm)*

```cpp
G4Material *ConstructNewMaterial (const G4String &name, 
                                  const std::vector< G4String > &elm, 
                                  const std::vector< G4double > &weight, 
                                  G4double dens, 
                                  G4bool isotopes=true, 
                                  G4State state=kStateSolid, 
                                  G4double temp=NTP_Temperature, 
                                  G4double pressure=CLHEP::STP_Pressure)
```

<b>조성비를 <font color = 'red'>질량비</font>로서 입력하고자 할 때 사용합니다.</b>

- name: 물질의 이름. 자유롭게 적으면 됨
- elm: 원소기호의 목록을 적은 G4String형 벡터. 화합물의 구성원소를 순서대로 적음
- weight: 원소별 조성비를 **질량비**형태로 적은 G4double형 벡터. 화합물의 구성원소별 조성비를 순서대로 적음
- dens: 물질의 밀도
- *isotopes: **입력하지 않아도 되는 인자**. 내부 소스코드를 뜯어보면, 사실 아예 이용되지 않는 변수임*
- *state: **입력하지 않아도 되는 인자**. 물질의 상을 특정하고 싶을 때 사용. 기본값은 kStateSolid(고체형)*
- *temp: **입력하지 않아도 되는 인자**. 물질의 온도를 특정하고 싶을 때 사용합 기본값은 NTP_Temperature(약 293.15 K)*
- *pressure: **입력하지 않아도 되는 인자**. 물질의 압력을 특정하고 싶을 때 사용. 기본값은 CLHEP::STP_Pressure(1 atm)*

이 함수를 이용할 때 주의할 점은, **원소기호를 적은 벡터의 원소 순서대로 조성비를 적어주어야 한다는 것**입니다.

예를 들어 물(H2O)을 이 함수를 사용하여 정의하려면 다음과 같이 입력하면 됩니다.

```cpp
auto nist = G4NistManager::Instance();
std::vector<G4String> elWater = {"H", "O"};
std::vector<G4int> nbWater = {2, 1};
auto matWater = nist->ConstructNewMaterial("Water", elWater, nbWater, 1. * g / cm3, true, kStateLiquid);
```

### 여러가지 물질로 혼합물 정의하기

물질들을 합쳐 놓은 혼합물을 정의하는 일이 필요할 수도 있을 것입니다. 이런 경우에는 G4Material 클래스의 생성자와, G4Material 클래스의 AddMaterial() 함수를 이용하면 됩니다. 각각의 원형은 다음과 같습니다.

```cpp
G4Material (const G4String &name, 
            G4double density, 
            G4int nComponents, 
            G4State state=kStateUndefined, 
            G4double temp=NTP_Temperature, 
            G4double pressure=CLHEP::STP_Pressure)
```

**G4Material의 생성자 중, 원소/물질의 조성비를 바탕으로 정의하는 데에 사용하는 생성자**

- name: 물질의 이름. 자유롭게 적으면 됨
- density: 물질의 밀도
- nComponents: 이 물질을 구성하는 원소/물질 종류의 수
- *state: **입력하지 않아도 되는 인자**. 물질의 상을 특정하고 싶을 때 사용. 기본값은 kStateUndefined(고체 혹은 기체형)*
- *temp: **입력하지 않아도 되는 인자**. 물질의 온도를 특정하고 싶을 때 사용. 기본값은 NTP_Temperature(약 293.15 K)*
- *pressure: **입력하지 않아도 되는 인자**. 물질의 압력을 특정하고 싶을 때 사용. 기본값은 CLHEP::STP_Pressure(1 atm)*

```cpp
void AddMaterial (G4Material *material, 
                  G4double fraction)
```

- material: 구성요소가 될 물질에 해당하는 G4Material 객체의 포인터
- fraction: 해당 물질의 조성비. **질량비**로 입력

예를 들어 20% 농도의 소금물을 정의한다면 다음과 같이 입력하면 됩니다. (소금질량 : 물질량 = 20 : 80, NTP에서 1.147 gcc로 알려져 있음)

```cpp
auto nist = G4NistManager::Instance();
std::vector<G4String> elNaCl = {"Na", "Cl"};
std::vector<G4int> nbNaCl = {1, 1};
auto matNaCl = nist->ConstructNewMaterial("NaCl", elNaCl, nbNaCl, 2.16 * g / cm3);
auto matWater = nist->FindOrBuildMaterial("G4_WATER");

auto matNaClSolution = new G4Material("NaClSolution", 1.147 * g / cm3, 2);
matNaClSolution->AddMaterial(matNaCl, 0.2);
matNaClSolution->AddMaterial(matWater, 0.8);
```

---

## Logical Volume 정의하기

Solid와 물질이 있으면, 손쉽게 Logical Volume을 정의할 수 있습니다. LogicalVolume은 **G4LogicalVolume** 클래스가 담당하며, 생성자는 다음과 같습니다.

```cpp
G4LogicalVolume (G4VSolid *pSolid, 
                 G4Material *pMaterial, 
                 const G4String &name, 
                 G4FieldManager *pFieldMgr=nullptr, 
                 G4VSensitiveDetector *pSDetector=nullptr, 
                 G4UserLimits *pULimits=nullptr, 
                 G4bool optimise=true)
```

- pSolid: G4VSolid 객체의 포인터. 앞서 정의한 Solid를 넣음
- pMaterial: G4Material 객체의 포인터. 앞서 정의한 Material을 넣음
- name: Logical Volume의 이름. 자유롭게 적으면 됨. 다만, 다른 Logical Volume과 겹치지 않게끔 고유의 이름을 권장. Solid의 이름과는 동일해도 상관없음
- *pFieldMgr: **입력하지 않아도 되는 인자**. 전기장/자기장 등에 대한 설정을 위해 사용*
- *pSDetector: **입력하지 않아도 되는 인자**. 스코어링용 SD에 대한 설정을 위해 사용*
- *pULimits: **입력하지 않아도 되는 인자**. 입자 트래킹에서의 제한치 등에 대한 설정을 위해 사용*
- *optimise: **입력하지 않아도 되는 인자**. 최적화에 대한 설정을 위해 사용*

대부분의 경우, **맨 위의 3가지 인자만 입력**하여 사용하시면 됩니다.

앞서 water phantom을 정의하기 위해 작성한 코드를 살펴보겠습니다.

{{< image src="03_newcode.png" width=100% >}}

물이라는 물질을 정의하기 위해 사용된 부분은 다음과 같습니다.

```cpp
auto nist = G4NistManager::Instance();
...
auto matWater = nist->FindOrBuildMaterial("G4_WATER")
```

그리고 phantomSol이라는 Solid를 다음 코드를 통해 생성하였습니다.

```cpp
auto phantomSol = new G4Box("phantom", .5 * phantomSize, .5 * phantomSize, .5 * phantomSize);
```

이 두가지를 이용하여, 물이 담긴 phantom을 정의하기 위해 다음 코드를 입력한 것입니다.

```cpp
auto phantomLog = new G4LogicalVolume(phantomSol, matWater, "phantom");
```

---

## 정리

이번 글에서는 원하는 물질을 정의하는 법을 알아보았습니다. 또한, 앞선 글에서 정의한 Solid에, 이번 글에서 정의한 물질을 연동하여 Logical Volume을 정의하는 방법까지 알아보았습니다.

다음 글에서는 지오메트리의 배치에 관한 내용, Physical Volume을 정의하는 법에 대해 알아보겠습니다.

---

## 더보기

- 동위원소 조성비를 임의로 조정하여 물질을 정의하는 법 (WIP)
