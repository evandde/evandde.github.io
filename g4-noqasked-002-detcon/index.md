# Geant4 무작정 따라하기 - 2. 지오메트리 정의하기


Geant4 무작정 따라하기 시리즈의 두번째. 지오메트리를 정의하는 방법에 대해 알아봅니다.

<!--more-->

## Geant4의 지오메트리 개념

### 기본

Geant4에서의 지오메트리 정의 과정은 다음의 세 클래스가 분리하여 담당합니다.

1. Solid (형태): 지오메트리의 **모양**, **크기** 등에 대한 정보를 담당
2. Logical Volume (특성): 지오메트리의 **매질** 등 질적인 특성에 대한 정보를 담당
3. Physical Volume (배치): 지오메트리의 **위치**, **회전**, **소속** 등 배치에 대한 정보를 담당

이 세 가지 클래스가 다음 다이어그램과 같이 유기적으로 연결되어 하나의 지오메트리 객체를 정의하게 됩니다.

{{< mermaid >}}
graph LR
A --> B --> C
A[Solid]
B[Logical Volume]
C[Physical Volume]
{{< /mermaid >}}

1.  모양에 대한 정보를 담은 Solid 객체를 정의.
2. 이 Solid 객체에 매질 정보를 넣어 Logical Volume 객체를 정의.
3. 이 Logical Volume 객체에 위치, 회전, 소속에 대한 정보를 넣어 Physical Volume 객체를 정의.

좀 더 구체적인 예시로 다이어그램을 그려보면 다음과 같습니다.

{{< mermaid >}}
graph LR
A --> B --> C
A[직육면체]
B[물이 담긴 직육면체]
C["(10, 0, 0)"에 위치한 물이 담긴 직육면체]
{{< /mermaid >}}

중요한 부분은, **Physical Volume까지 정의되어야만** 비로소 **시뮬레이션 세계에 존재**하게 된다는 점입니다.

즉, Solid만 정의된 상태인 "직육면체"나, Logical Volume까지만 정의된 "물이 담긴 직육면체"는 아직 시뮬레이션 세계에 존재하지 않는 **개념적인 존재일 뿐**입니다. 이를 <u>**Physical Volume으로서 "(10, 0, 0)에 놓겠다"는 부분이 정의되어야 그제서야 시뮬레이션 세계에 존재**</u>하게 됩니다.

### 응용

Geant4에서는 지오메트리를 **Solid(형태)**, **Logical Volume(특성)**, <b>Physical Volume(배치)</b>의 세 단계로 나누어 관리하기 때문에, 유사한 지오메트리를 여러개 배치하여야 할 때 이전에 만들어둔 객체를 재사용하여 효율적인 코딩이 가능합니다. Logical Volume을 재사용하는 다음의 다이어그램을 살펴봅시다.

{{< mermaid >}}
graph LR
A --> B --> C & D & E
A[직육면체]
B[물이 담긴 직육면체]
C["(0, 0, 0)"에 위치한 물이 담긴 직육면체]
D["(10, 0, 0)"에 위치한 물이 담긴 직육면체]
E["(20, 0, 0)"에 위치한 물이 담긴 직육면체]
{{< /mermaid >}}

"물이 담긴 직육면체" 라는 Logical Volume을 여러 위치에 배치해야 하는 경우, 위 다이어그램과 같이 Physical Volume만을 변경하며 여러 번 정의해줄 수 있습니다.

혹은, 모양이 동일한데 매질이 달라져야 하는 경우에는 다음과 같이 Solid 객체를 재사용하여 구성할 수도 있습니다.

{{< mermaid >}}
graph LR
A --> B & C
B --> D & E
C --> F
A[직육면체]
B[물이 담긴 직육면체]
C[공기가 담긴 직육면체]
D["(0, 0, 0)"에 위치한 물이 담긴 직육면체]
E["(10, 0, 0)"에 위치한 물이 담긴 직육면체]
F["(20, 0, 0)"에 위치한 공기가 담긴 직육면체]
{{< /mermaid >}}

---

## 실전

일단 이론은 이정도만 해두고, 코드를 직접 작성해봅시다.

Geant4 코드 작성 시, 지오메트리에 대한 내용을 적는 곳은 정해져 있습니다. G4VUserDetectorConstruction 클래스를 상속받아 만드는 UserClass에 존재하는 G4VPhysicalVolume* Construct() 함수입니다. 하지만 이렇게 정석대로 설명하면 너무 생소하실테니 제가 제공해드렸던 템플릿 코드에서 살펴보도록 하죠.

템플릿 코드의 **src 디렉토리** 내부에 <b>DetectorConstruction.cc</b>라는 파일이 있을 것입니다. 이 파일을 열면 다음 그림과 같은 코드가 나옵니다.

{{< image src="01_detcon.png" width=100% >}}

여기서 18번째 줄부터 나오는 <b>G4VPhysicalVolume *DetectorConstruction::Construct() 함수 안</b>에 지오메트리에 대한 내용을 적으면 됩니다.

다음과 같이 정의되는 물이 담긴 박스를 만들어보겠습니다.

- Solid: 가로, 세로, 높이가 5 cm인 정육면체
- Logical Volume: 매질을 물로 채움
- Physical Volume: 박스의 중심이 (0, 0, 10 cm)가 되게끔 위치시킴

### "물" 정의하기

일단 물이라는 물질을 가져와야 합니다. 자세한 설명은 나중에 하기로 하고, 아래 그림에서 표시된 위치에 다음 한 줄을 적어넣습니다.

{{< highlight cpp "linenos=false" >}}
auto matWater = nist->FindOrBuildMaterial("G4_WATER");
{{< /highlight >}}

{{< image src="02_material.png" width=100% >}}

이 한 줄을 통해, **matWater** 라는 변수는 "물"이라는 물질로 정의되었습니다.

### 물이 담긴 박스 위치시키기

이제 solid, logical volume, physical volume을 정의해봅시다.

아래 그림에서 표시된 위치에 다음 내용을 적어 넣습니다.

{{< highlight cpp "linenos=false" >}}
// Water box
auto boxSize = 5. * cm;
auto boxPos = G4ThreeVector(0., 0., 10.*cm);
auto boxSol = new G4Box("Box", .5 * boxSize, .5 * boxSize, .5 * boxSize);
auto boxLog = new G4LogicalVolume(boxSol, matWater, "Box");
new G4PVPlacement(nullptr, boxPos, boxLog, "Box", worldLog, false, 0);
{{< /highlight >}}

{{< image src="03_waterbox.png" width=100% >}}

{{< admonition tip >}}

boxSize, boxPos와 같은 변수의 경우에는, 사실 따로 변수로 만들지 않고 직접 solid나 physical volume에 값을 적어도 됩니다. 하지만 재사용성 및 가독성을 고려하여 변수로 만들어 사용하였습니다.

{{< /admonition >}}

### 실행해보기

이제 작성한 코드를 저장하고 빌드를 한 뒤 UI모드로 실행하면, 물박스가 추가된 것을 확인할 수 있습니다.

지난 글에서 만들어뒀던 build 디렉토리에 들어간 뒤, make 명령어만 입력하면 빌드가 수행됩니다.

이어서, <b>./g4_minimal</b> 이라고 입력하여 실행하면 UI모드로 실행할 수 있습니다.

```bash
cd build
make
./g4_minimal
```

실행하면 다음 그림과 같은 창이 나타날 것입니다.

{{< image src="04_UI.png" width=100% >}}

왼쪽의 탭에서 **Scene tree**를 클릭하면, 화면에 나타나는 지오메트리의 트리구조를 볼 수 있습니다.

이 중, **Touchables** 하위에 있는 것이 여러분이 만든 지오메트리 목록입니다.

지금 저희가 만들었던 물박스는 **Box**라는 이름으로 표시되고 있으며, 왼쪽의 체크박스를 누르면 오른쪽 그림에서 조그마한 박스가 나타났다 사라졌다 하는 것을 확인할 수 있을 것입니다.

---

## 최종 파일 다운받는 법

이번 글에서 작성한 코드는 [이 링크](https://github.com/evandde/g4_minimal/archive/ecef9c37af224cd65b866557f825508a71043e11.zip)를 통해 다운받을 수 있습니다.

혹은 git repository를 clone하신 분의 경우에는, example branch의 이전 커밋 중 V1_DetCon이라는 커밋을 참고하셔도 됩니다.

---

## 정리

새로 추가된 코드 부분을 정리하면 다음 그림과 같습니다. 주석이나 단순히 변수를 정의한 부분은 따로 표시하지 않았습니다.

{{< image src="05_newcode.png" width=100% >}}

위 코드에서 어떤 코드가 무슨 역할을 하고 있는지만 기억하시면 됩니다.

세부적인 설명은 다음 글에서 하도록 하겠습니다.
