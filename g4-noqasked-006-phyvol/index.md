# Geant4 무작정 따라하기 - 6. 지오메트리 배치하기


Geant4 무작정 따라하기 시리즈의 여섯번째. Physical Volume을 정의하여 지오메트리를 시뮬레이션 세계에 배치해 보겠습니다.

<!--more-->

## 기본 이론

Physical Volume을 정의하는 방법을 이해하려면, 먼저 다음의 개념에 대해 알아야 합니다.

- World
- Mother Volume & Daughter Volume
- Copy number

### World

Geant4 시뮬레이션은 여러 다양한 지오메트리를 놓아 구성된 공간에서 이루어집니다. 이 중 **가장 큰 최외곽의 지오메트리**를 **World**라고 합니다. World는 적당한 수준의 여유공간을 두고 **모든 다른 지오메트리를 World 내부에 포함**할 수 있도록 설정되어야 합니다. World는 가장 간단하고 연산측면에서도 효율성이 좋은 **G4Box 형태**로 제작하는 것이 일반적입니다.

실제 세상에서 외부 환경은 무한히 펼쳐져 있지만, 아주 멀리 있는 구조물이나 공기같은 환경적 요인이 관심있는 대상물에서 계측하는 결과에 유의미한 영향을 줄 확률은 그리 높지 않을 것이라 생각할 수 있습니다. 시뮬레이션으로 실제 세상을 모사할 때 무한한 공간을 다 넣을 수는 없으므로 **적당한 수준에서 잘라내어 모사**를 하게 될 것입니다. 이 **잘라진 세상의 경계**를 **World**라고 생각하시면 됩니다.

어떤 지오메트리나 입자도 World 바깥에서는 정의되지 않습니다. 어떤 입자가 수송되는 과정에서 World의 경계면을 만나 외부로 나가려는 순간이 되면, Geant4는 더 이상 그 입자를 수송하지 않고 그 즉시 해당 입자에 대한 연산을 종료합니다. 관심 영역 밖으로 탈출한 입자로 보는 것입니다.



### Mother Volume & Daughter Volume

Geant4에서는 모든 지오메트리가 다른 지오메트리에 포함되는 구조로 배치되어야만 합니다. 우리가 작성하고 있는 코드를 예로 들자면, water phantom이라는 지오메트리는 World라는 지오메트리 내에 포함되어 있는 식으로 말입니다. 이렇게 A라는 지오메트리가 B 지오메트리 내에 포함될 때, **B**를 **A의 Mother Volume**이라고 하고, **A**를 **B의 Daughter Volume**이라고 합니다.

위 사항에서 단 하나 예외가 존재하는데, 그것이 바로 World 입니다. **World는 Mother Volume을 가지지 않는 유일한 지오메트리**로, 모든 지오메트리 계층에 있어 최상위에 존재하게 됩니다.

Geant4에서는 어떤 지오메트리의 위치를 참조할 때, 그 지오메트리의 **Mother Volume의 좌표계를 기준**으로 위치를 가져옵니다. 예를 들어 다음 그림과 같은 경우를 살펴봅시다. 

{{< image src="01_mothervol.png" width=100% >}}

이 그림에서 지오메트리 계층도는 다음과 같을 것입니다.

{{< mermaid >}}
graph TD
World --- A --- B
World --- C
{{< /mermaid >}}

여기서 <font color='red'><b>A</b></font>의 위치는 A의 Mother Volume인 **World를 기준**으로 판단합니다. (4, 4)에 A가 있다고 보는 것이지요.

<font color='green'><b>C</b></font>의 위치도 C의 Mother Volume인 **World를 기준**으로 판단합니다. C는 (-3, 4)에 위치하는 것이 되겠네요.

<font color='blue'><b>B</b></font>의 위치는 B의 Mother Volume인 <font color='red'><b>A</b></font>를 기준으로 판단합니다. 여기서 **World를 기준으로 하지 않음에 주의**하세요. 즉 <font color='red'><b>A의 원점</b></font>을 기준으로 <font color='blue'><b>B의 위치는 (2, 1)</b></font>이 됩니다.

B가 World를 기준으로 어디에 위치하였는지를 판단하려면, Mother Volume이 World가 될 때까지 자신의 위치에 Mother Volume의 위치를 순차적으로 더해나가면 됩니다. A에서의 B의 위치는 (2, 1)이고, World에서의 A의 위치가 (4, 4)이므로, 이를 더하면 World에서의 B의 위치가 (6, 5)임을 알 수 있는 것이지요.



### Copy Number

Copy Number란 Geant4에서 지오메트리를 구분하는 데에 사용되는 번호입니다. 상황에 따라 Replica Number라고 부르기도 합니다. Geant4 시뮬레이션 시 모든 지오메트리는 예외없이 Copy Number를 가지고 있습니다. 

지오메트리를 서로 구분하는 데에 사용한다고 했습니다만, 중복되는 번호를 부여한다고 해서 문제가 생기는 것은 아닙니다. 사실 **대부분의 지오메트리에 대해서는 그냥 아무 생각없이 0으로 설정하여 사용**해도 괜찮습니다. Copy Number에 관심을 가져야하는 경우는 대표적으로 다음의 두 경우입니다.

- 동일한(혹은 유사한) 지오메트리가 여러 개 존재하는 경우
- 그 지오메트리에서 발생한 정보를 기록하고자 하는 경우 (스코어링)

처음의 경우는 다음과 같은 케이스입니다.

{{< mermaid >}}
graph LR
A --> B --> C & D & E & F & G
A[직육면체]
B[물이 담긴 직육면체]
C["(0, 0, 0)"에 위치한 물이 담긴 직육면체]
D["(10, 0, 0)"에 위치한 물이 담긴 직육면체]
E["(20, 0, 0)"에 위치한 물이 담긴 직육면체]
F["(30, 0, 0)"에 위치한 물이 담긴 직육면체]
G["(40, 0, 0)"에 위치한 물이 담긴 직육면체]
{{< /mermaid >}}

이와 같은 경우, 5개의 동일한 직육면체가 10 cm씩 이동하며 배치되어야 합니다. 이런 경우에 각 지오메트리의 Copy Number를 0, 1, 2, 3, 4로 보고, 각각의 위치를 ([Copy Number] * 10 cm, 0, 0)으로 간단하게 생각할 수 있을 것입니다. 이렇게 Copy Number를 일종의 매개변수처럼 사용하여 여러 개의 지오메트리를 쉽게 배치하는 데에 사용하는 경우가 있습니다. 

{{< admonition note >}}

위 내용은 G4PVParameterised 클래스를 개념적으로 설명한 것입니다. 자세한 사용법은 이 시리즈에서 다루지 않습니다

{{< /admonition >}}

두 번째 경우는 이 시리즈의 뒤쪽에서 다루게 될 **스코어링** 파트에서 보다 자세히 다룰 예정이므로 여기서는 간단하게만 설명하겠습니다.

예를 들어 어떤 지오메트리의 흡수선량을 계산하고자 Geant4 시뮬레이션을 돌린다고 가정해봅시다. 그런데 흡수선량의 평가가 필요한 지오메트리가 여러개라면 각각의 흡수선량을 따로따로 기록하고 관리해야 할 것입니다. 이 때 **흡수선량이라는 값**을 따로따로 보관하기 위한 <font color='red'><b>사물함 번호</b></font>에 해당하는 것이 바로 <font color='red'><b>Copy Number</b></font>입니다. 우선은 이 정도로만 설명해두고, 자세한 사항은 나중에 다루도록 하지요.



### 배치할 때의 주의사항

지오메트리를 배치할 때 반드시 지켜야하는 주의사항이 있습니다.

- Daughter Volume은 반드시 Mother Volume 내에 포함되는 형태여야 하며, Mother Volume 밖까지 빠져나와서 미포함된 영역이 있어서는 안됨
- 동일한 Mother Volume을 가지는 지오메트리끼리 서로 겹쳐지는 영역이 있어서는 안됨

간단히 말해, 하위계층의 지오메트리는 상위계층인 Mother Volume 내에 쏙 들어가야하고, 같은 계층의 지오메트리끼리는 겹치지 않아야 한다는 것입니다.

**다만 지오메트리의 면, 선, 점끼리만 맞닿는 것은 괜찮습니다**.

---

## Physical Volume의 종류

Geant4에서는 지오메트리를 배치하는 여러가지 방법을 제공합니다.

- G4PVPlacement

  한 번에 하나의 지오메트리를 배치하는 방법입니다. 가장 간단하고 자주 사용되는 방법입니다.

- G4PVReplica

  동일한 지오메트리를 반복적으로 놓아야 할 때 사용하기 좋은 클래스입니다.

- G4PVParameterised

  유사한 지오메트리를 반복적으로 놓아야 할 때 사용하기 좋은 클래스입니다. Copy Number를 일종의 매개변수로 사용하여, 각 지오메트리의 위치, Solid, 매질 등 여러 조건을 바꾸며 배치할 수 있습니다.

- G4PVDivision

  어떤 지오메트리를 축방향(X, Y, Z, 직경, 중심각)에 따라 절단한 지오메트리를 놓아야 할 때 사용하기 좋은 클래스입니다.

이 외에도 몇 종류 더 있으며, Geant4에서 제공하고 있는 [Geant4 Doxygen](https://geant4.kek.jp/Reference/)에서 G4VPhysicalVolume 클래스의 레퍼런스 페이지([10.7.p01 버전](https://geant4.kek.jp/Reference/10.07.p01/classG4VPhysicalVolume.html))에 들어가면 상속받은 클래스 목록(*Inheritance diagram for G4VPhysicalVolume*) 부분을 통해 확인할 수 있습니다.

이 시리즈에서는 G4PVPlacement 클래스 한 가지만 설명할 것입니다.

---

## G4PVPlacement

G4PVPlacement 클래스는 Logical Volume 한 개를 배치하는 데에 사용하는 클래스입니다. 생성자는 총 4가지 입니다만, 먼저 두 가지만 살펴보겠습니다.

### 생성자

```cpp
G4PVPlacement (G4RotationMatrix *pRot, 
               const G4ThreeVector &tlate, 
               G4LogicalVolume *pCurrentLogical, 
               const G4String &pName, 
               G4LogicalVolume *pMotherLogical, 
               G4bool pMany, 
               G4int pCopyNo, 
               G4bool pSurfChk=false)
```

- pRot: G4RotationMatrix 객체의 포인터. 지오메트리를 배치할 때 회전에 대한 정보를 입력하는 데에 사용
- tlate: G4ThreeVector 객체. 지오메트리의 위치에 대한 정보를 입력하는 데에 사용
- pCurrentLogical: G4LogicalVolume 객체의 포인터. 앞서 정의한 Logical Volume을 넣음
- pName: Physical Volume의 이름. 자유롭게 적으면 됨. 다만, 다른 Physical Volume과 겹치지 않게끔 고유의 이름을 권장. Solid 및 Logical Volume의 이름과는 동일해도 상관없음
- pMotherLogical: G4LogicalVolume 객체의 포인터. 이 지오메트리의 Mother Volume이 될 지오메트리의 Logical Volume을 넣음
- *pMany: **무조건 false로 쓰면 되는 인자**. Geant4에서 아직 구현되지 않은 기능임. 어떤 값을 넣어도 기능하지 않지만, 대부분의 예제 코드에서는 false로 입력하는 편*
- pCopyNo: Physical Volume의 Copy Number. **정수값**으로 입력하며, 별다른 목적이 없을 경우 대개 **0**을 부여하는 편
- *pSurfChk: **입력하지 않아도 되는 인자**. 지오메트리 간 겹침 검사를 수행할 지의 여부를 설정하는 데에 사용. 기본 값은 false*

```cpp
G4PVPlacement (const G4Transform3D &Transform3D, 
               G4LogicalVolume *pCurrentLogical, 
               const G4String &pName, 
               G4LogicalVolume *pMotherLogical, 
               G4bool pMany, 
               G4int pCopyNo, 
               G4bool pSurfChk=false)
```

- Transform3D: G4Transform3D 객체. 지오메트리를 배치할 때 평행이동 및 회전에 대한 정보를 입력하는 데에 사용
- pCurrentLogical: G4LogicalVolume 객체의 포인터. 앞서 정의한 Logical Volume을 넣음
- pName: Physical Volume의 이름. 자유롭게 적으면 됨. 다만, 다른 Physical Volume과 겹치지 않게끔 고유의 이름을 권장. Solid 및 Logical Volume의 이름과는 동일해도 상관없음
- pMotherLogical: G4LogicalVolume 객체의 포인터. 이 지오메트리의 Mother Volume이 될 지오메트리의 Logical Volume을 넣음
- *pMany: **무조건 false로 쓰면 되는 인자**. Geant4에서 아직 구현되지 않은 기능임. 어떤 값을 넣어도 기능하지 않지만, 대부분의 예제 코드에서는 false로 입력하는 편*
- pCopyNo: Physical Volume의 Copy Number. **정수값**으로 입력하며, 별다른 목적이 없을 경우 대개 **0**을 부여하는 편
- *pSurfChk: **입력하지 않아도 되는 인자**. 지오메트리 간 겹침 검사를 수행할 지의 여부를 설정하는 데에 사용. 기본 값은 false*

이 두 가지 생성자는 거의 비슷하지만, **위치/회전에 대한 정보를 입력하는 방식**이 다릅니다. 첫번째 생성자는 회전행렬(G4RotationMatrix)과 위치에 해당하는 벡터(G4ThreeVector)를 입력하고, 두번째 생성자는 회전과 평행이동을 묶어서 다루는 선형변환(G4Transform3D)을 입력하게 되어있지요. 

중요한 점은 입력하는 방식만 다른 것이 아니라, <font color='red'><b>배치하는 방식 자체가 근본적으로 다르다</b></font>는 데에 있습니다. 첫번째 생성자는 Mother Volume의 좌표계를 회전시킨 뒤 평행이동을 하는 방식이고, 두번째 생성자는 배치되는 자기자신의 좌표계가 평행이동한 뒤 그자리에서 회전하는 방식입니다.

<br>

말로 설명하면 어려우니, 실제 예시를 통해 살펴봅시다.

회전을 명확하게 확인하기 위해, 기존의 정육면체에서 X축 방향의 길이를 두배로 늘렸습니다. 10 cm × 5 cm × 5 cm의 G4Box형태 Solid를 정의하고, 물을 채워 Logical Volume까지 정의한 상태입니다. 코드로는 다음과 같습니다.

```cpp
auto phantomXSize = 10. * cm;
auto phantomYSize = 5. * cm;
auto phantomZSize = 5. * cm;
auto phantomSol = new G4Box("phantom", 
                            .5 * phantomXSize, 
                            .5 * phantomYSize, 
                            .5 * phantomZSize);
auto phantomLog = new G4LogicalVolume(phantomSol, matWater, "phantom");
```

이제 이 지오메트리를 <b>(0, 0, 20 cm) 위치</b>에 <b>Y축을 기준으로 30° 회전</b>시켜서 배치해보도록 하겠습니다.

#### G4RotationMatrix & G4ThreeVector 이용

첫번째 생성자를 이용하여 다음과 같이 코드를 작성해 보았습니다.

```cpp
auto phantomPos = G4ThreeVector(0., 0., 20. * cm);
auto phantomRot = new G4RotationMatrix(G4ThreeVector(0., 1., 0.), 30. * deg);
new G4PVPlacement(phantomRot, 
                  phantomPos, 
                  phantomLog, 
                  "phantom", 
                  worldLog, 
                  false, 
                  0);
```

결과는 다음과 같습니다. +Y축 방향에서 아래로 내려다본 그림입니다.

{{< image src="02_motherframe.png" width=100% >}}

이상한 점을 찾으셨나요? 축을 기준으로 회전을 시키면 축을 위에서 봤을때 **반시계방향으로 회전**해야 하는데 반대방향인 시계방향으로 돌아갔습니다. 이유는 이 생성자가 <b>Mother Volume의 좌표계를 회전시킨 뒤 평행이동을 하는 방식으로 지오메트리를 배치</b>하기 때문입니다. 다음의 그림을 보면 좀 더 이해가 쉬울 것입니다.

{{< image src="03_motherframe.gif" width=100% >}}

보시다시피 좌표계 자체가 먼저 돌아간 뒤, 돌아간 좌표계에 따라 지오메트리를 이동시킵니다. (맨 마지막에 시계방향으로 돌린 것은 그냥 보기 편하려고 원래 방향으로 되돌린 것일 뿐이므로 배치와는 무관합니다) 이런 방식을 취하기 때문에, 일반적으로 생각한 방식과 반대로 회전하는 것처럼 보이게 됩니다.

#### G4Transform3D 이용

이번에는 두번째 생성자를 이용하여 다음과 같이 코드를 작성해 보았습니다.

{{< admonition warning >}}

G4Transform3D의 생성자에는 <b>G4RotationMatrix의 객체 자체</b>가 인자로 사용됩니다. G4RotationMatrix 객체의 <b>포인터가 아님에 주의</b>하세요.

{{< /admonition >}}

```cpp
auto phantomPos = G4ThreeVector(0., 0., 20. * cm);
auto phantomRot = G4RotationMatrix(G4ThreeVector(0., 1., 0.), 30. * deg);
new G4PVPlacement(G4Transform3D(phantomRot, phantomPos), 
                  phantomLog, 
                  "phantom",
                  worldLog, 
                  false, 
                  0);
```

결과는 다음과 같습니다. 마찬가지로 +Y축 방향에서 아래로 내려다본 그림입니다.

{{< image src="04_g4transform3d.png" width=100% >}}

이번에는 일반적인 예상과 같이 **반시계방향으로 회전한 상태로 배치**가 되었습니다. 이 생성자는 자기 자신인 phantom 지오메트리의 좌표계가 평행이동한 뒤 그 자리에서 회전하는 방식을 취합니다. 

그래서 G4Transform3D 부분을 "<b>평행이동변환을 한 뒤, 이어서 회전변환을 가한다</b>"의 의미를 갖게끔 다음과 같이 입력하여도 동일한 결과를 보여줍니다. 

```cpp
auto phantomPos = G4ThreeVector(0., 0., 20. * cm);
auto phantomRot = G4RotationMatrix(G4ThreeVector(0., 1., 0.), 30. * deg);
new G4PVPlacement(G4Translate3D(phantomPos) * G4Rotate3D(phantomRot), 
                  phantomLog, 
                  "phantom", 
                  worldLog, 
                  false, 
                  0);
```

혹은 "<b>Z축으로 30 cm 평행이동을 한 뒤, Y축을 기준으로 30° 회전</b>"의 의미를 갖도록 다음과 같이 입력해도 같은 결과가 나오지요.

```cpp
new G4PVPlacement(G4TranslateZ3D(20. * cm) * G4RotateY3D(30. * deg), 
                  phantomLog, 
                  "phantom", 
                  worldLog, 
                  false, 
                  0);
```

배치되는 방식을 그림을 통해 살펴보면 다음과 같습니다.

{{< image src="05_g4transform3d.gif" width=100% >}}

#### 회전 후 그 방향으로 이동

경우에 따라서는, 회전시킨 뒤 그 방향으로 이동하도록 하고 싶을 때도 있을 것입니다. 예를 들어 원의 둘레를 따라 구조물을 빙 둘러 배치해야 하는 경우처럼 말이죠. 이런 경우에는 <b>두 번째 생성자를 이용하되, 평행이동과 회전의 순서를 바꾸면 됩니다</b>. 말 그대로 "<b>회전 후 이동</b>"이니까 말이죠. 다만, G4Transform3D 클래스 객체를 생성할 때 평행이동과 회전을 함께 입력하는 식으로 만들게 되면 "이동 후 회전"의 방식이 되어버리므로, <b>회전 후 이동을 직접 명시하는 방식으로 입력</b>해야 합니다.

코드로 작성하면 다음과 같습니다.

```cpp
auto phantomPos = G4ThreeVector(0., 0., 20. * cm);
auto phantomRot = G4RotationMatrix(G4ThreeVector(0., 1., 0.), 30. * deg);
new G4PVPlacement(G4Rotate3D(phantomRot) * G4Translate3D(phantomPos),
                  phantomLog, 
                  "phantom", 
                  worldLog, 
                  false, 
                  0);
```

혹은 다음과 같이 입력해도 동일한 결과가 나올 것입니다.

```cpp
new G4PVPlacement(G4RotateY3D(30. * deg) * G4TranslateZ3D(20. * cm), 
                  phantomLog, 
                  "phantom", 
                  worldLog, 
                  false, 
                  0);
```

결과는 다음과 같습니다. 마찬가지로 +Y축 방향에서 아래로 내려다본 그림입니다.

{{< image src="06_rotatethentranslate.png" width=100% >}}

위치 자체가 (0, 0, 20 cm)가 아니라 좀 더 왼쪽 위로 이동한 것을 볼 수 있습니다. 이렇게 배치할때 배치되는 과정을 그림으로 보면 다음과 같습니다.

{{< image src="07_rotatethentranslate.gif" width=100% >}}

이 세 가지 배치방식만 잘 이해하시면 원하는 방식으로 회전/이동 시키는 데에 무리없이 적용할 수 있을 것입니다.

### 나머지 두 가지 생성자

아까 생성자가 총 4개라고 했었으니, 이제 남은 2개도 살펴봅시다.

```cpp
G4PVPlacement (G4RotationMatrix *pRot, 
               const G4ThreeVector &tlate,
               const G4String &pName, 
               G4LogicalVolume *pLogical, 
               G4VPhysicalVolume *pMother, 
               G4bool pMany,
               G4int pCopyNo, 
               G4bool pSurfChk=false)
```

```cpp
G4PVPlacement (const G4Transform3D &Transform3D, 
               const G4String &pName, 
               G4LogicalVolume *pLogical, 
               G4VPhysicalVolume *pMother, 
               G4bool pMany,
               G4int pCopyNo, 
               G4bool pSurfChk=false)
```

앞서 설명했던 두 가지 생성자와 거의 동일하고, 다음의 두 부분만 차이가 있습니다.

- 인자의 입력 순서가 약간 바뀜(Physical Volume의 이름)
- Mother Volume을 입력할 때 Mother Volume의 Logical Volume 대신 Physical Volume으로 입력

기능은 앞서 설명했던 두 가지 생성자와 **완전히 동일**합니다. 그래서 이 둘은 거의 사용할 일이 없습니다.

---

## 정리

이번 글에서는 회전과 이동을 통해 원하는 위치에 원하는 각도로 지오메트리를 배치하는 법을 알아보았습니다. 이로써 여러분은 Geant4 시뮬레이션을 돌리는 데에 필수요소 중 하나인 **지오메트리를 정의하는 법**을 다 배우셨습니다.

다음 글부터는 선원항을 정의하는 법에 대해 알아보도록 하겠습니다.
