# Geant4 무작정 따라하기 - 5. 벡터, 회전, 변환


Geant4 무작정 따라하기 시리즈의 다섯번째. 위치와 회전을 표현하는 데에 사용하는 클래스에 대해 살펴봅니다.

<!--more-->

이제 Solid와 Logical Volume을 정의하는 방법까지 다루었으니, 지오메트리의 배치에 관한 내용인 Physical Volume만 남았습니다. 하지만, 이 내용을 다루기 위해서는 먼저 Geant4에서 **위치**와 **회전**을 어떻게 표현하는지 알아야 합니다. 이번 글은 실습 없이 이론만 설명하게 될 것 같지만, 다음 글에서 꼭 필요한 내용이니 잘 따라오시기 바랍니다.

---

## G4ThreeVector

G4ThreeVector는 Geant4와 연동하여 설치하는 CLHep 라이브러리 중 **Hep3Vector 클래스**의 다른 이름입니다. 이 클래스는 **3차원 좌표공간 상의 벡터**에 해당하는 개념을 담당하는 클래스이며, 벡터 연산을 위한 다양한 기능을 담고 있습니다. 이를 모두 다루는 것은 무리가 있으므로, 대표적인 기능 몇 가지만 살펴보겠습니다.

### 생성자

```cpp
Hep3Vector ()
Hep3Vector (double x, 
            double y,
            double z)
```

- x, y, z: 3차원 벡터의 각 좌표값에 해당하는 실수

G4ThreeVector 객체를 생성하는 방법입니다. 아무런 인자 없이 그냥 <b>G4ThreeVector()</b>라고 입력하면 <b>(0, 0, 0)</b>에 해당하는 벡터가 정의됩니다. 혹은, double 형 인자 3개를 넣어 <b>G4ThreeVector(x, y, z)</b>로 입력하여 <b>(x, y, z)</b>에 해당하는 벡터를 정의할 수도 있습니다.

### X, Y, Z 값

```cpp
double x () const
double y () const
double z () const
```

따로 입력인자 없이, 해당 벡터의 X, Y, Z 값을 가져오는 데에 사용하는 함수입니다. 다음과 같이 사용합니다.

```cpp
auto vec = G4ThreeVector(1., 2., 3.);
auto xVal = vec.x(); // xVal = 1.;
auto yVal = vec.y(); // yVal = 2.;
auto zVal = vec.z(); // zVal = 3.;
```

### 연산자

```cpp
bool operator== (const Hep3Vector &) const
bool operator!= (const Hep3Vector &) const
Hep3Vector operator + (const Hep3Vector &, const Hep3Vector &)
Hep3Vector operator - (const Hep3Vector &, const Hep3Vector &)
Hep3Vector operator * (const Hep3Vector &, double a)
Hep3Vector operator * (double a, const Hep3Vector &)
```

벡터 간의 비교연산, 합연산, 차연산도 제공하고 있으며, 벡터와 실수끼리의 곱에 해당하는 상수배연산도 제공하고 있습니다.

---



## G4RotationMatrix

Geant4와 연동하여 설치하는 CLHep 라이브러리 중 **HepRotation 클래스**의 다른 이름입니다. 이 클래스는 벡터의 회전변환에 관한 다양한 기능을 담고 있습니다. 마찬가지로 몇 가지만 간단하게 살펴보겠습니다.



### 생성자

```cpp
HepRotation ()
HepRotation (const Hep3Vector &axis, double delta)
HepRotation (double phi, double theta, double psi)
HepRotation (const Hep3Vector &colX, const Hep3Vector &colY, const Hep3Vector &colZ)
```

- axis: 회전 축에 해당하는 G4ThreeVector 객체
- delta: 회전 각도
- phi, theta, psi: 회전에 따른 Euler 각도
- colX, colY, colZ: 회전한 좌표계의 새로운 직교좌표축 3개에 해당하는 G4ThreeVector 객체

아무런 인자를 넣지 않고 추후 G4RotationMatrix 클래스의 함수를 이용해 회전을 연산하고자 하는 경우에는 입력인자가 없는 생성자인 <b>G4RotationMatrix()</b>를 이용할 수 있습니다.

회전 축과 각도를 알고 있는 상태라면, <b>G4RotationMatrix(axis, delta)</b>의 형태로 회전행렬에 대한 객체를 바로 정의할 수 있습니다.

회전된 좌표계와 기존 좌표계를 바탕으로 오일러 각을 계산할 수 있다면, <b>G4RotationMatrix(phi, theta, psi)</b>의 형태로 회전행렬 객체를 정의하면 됩니다.

회전된 좌표계의 직교좌표축 3개를 알고 있다면, 이를 각각 새로운 x, y, z축으로 상정하여 <b>G4RotationMatrix(colX, colY, colZ)</b> 생성자를 이용할 수 있습니다.

### 회전 연산 함수

```cpp
HepRotation & rotateX (double delta)
HepRotation & rotateY (double delta)
HepRotation & rotateZ (double delta)
HepRotation & rotate (double delta, const Hep3Vector &axis)
```

- delta: 회전 각도
- axis: 회전 축에 해당하는 G4ThreeVector 객체

이미 생성해둔 G4RotationMatrix 객체에 대해, 추가적으로 회전 연산을 더 수행해야 하는 경우, 위와 같은 함수를 사용할 수 있습니다. 

rotateX(), rotateY(), rotateZ() 함수는 각각 X, Y, Z축을 회전 축으로 하여 회전 연산을 추가하는 함수이고, rotate()함수는 임의의 회전 축에 대해 회전 연산을 추가하는 함수입니다.

### 연산자

```cpp
bool operator== (const HepRotation &r) const
bool operator!= (const HepRotation &r) const
HepRotation operator* (const HepRotation &r) const
```

회전행렬 간 비교연산자를 제공하며, 회전행렬끼리 곱하여 회전 연산을 추가하는 것 또한 가능합니다.

---



## G4Transform3D

Geant4와 연동하여 설치하는 CLHep 라이브러리 중 **Transform3D 클래스**의 다른 이름입니다. 이 클래스는 회전변환, 평행이동변환, 대칭이동변환, 확대/축소변환과 같은 선형변환에 관한 여러가지 기능을 담고 있습니다.

다만, Physical Volume에서는 G4Transform3D의 변환 종류 중 **회전변환**과 **평행이동변환**만 이용하므로, 이 부분만 알아보도록 하겠습니다.

### 생성자

```cpp
Transform3D ()
Transform3D (const CLHEP::HepRotation &mt, const CLHEP::Hep3Vector &v)
```

- mt: G4RotationMatrix 객체. 회전변환의 정보를 담은 회전행렬
- v: G4ThreeVector 객체. 평행이동변환의 정보를 담은 3차원 벡터

아무런 인자를 넣지 않고 추후 G4Transform3D 클래스의 함수를 이용해 변환을 연산하고자 하는 경우에는 입력인자가 없는 생성자인 <b>G4Transform3D()</b>를 이용할 수 있습니다.

변환에 대한 회전행렬과 평행이동벡터를 알고 있는 상태라면, <b>G4Transform3D(mt, v)</b>의 형태로 객체를 바로 정의할 수 있습니다.

### 상속받은 클래스의 생성자

Transform3D를 상속받은 클래스들이 있습니다. 여기서는 그 중 8가지를 살펴보겠습니다.

- 평행이동 관련
  - G4Translate3D: Translate3D 클래스의 다른 이름
  - G4TranslateX3D: TranslateX3D 클래스의 다른 이름
  - G4TranslateY3D: TranslateY3D 클래스의 다른 이름
  - G4TranslateZ3D: TranslateZ3D 클래스의 다른 이름
- 회전 관련
  - G4Rotate3D: Rotate3D 클래스의 다른 이름
  - G4RotateX3D: RotateX3D 클래스의 다른 이름
  - G4RotateY3D: RotateY3D 클래스의 다른 이름
  - G4RotateZ3D: RotateZ3D 클래스의 다른 이름

각 클래스의 생성자는 다음과 같습니다. (입력인자 없이 사용하는 생성자는 생략하였음)

먼저 평행이동 관련 클래스입니다.

```cpp
Translate3D (const CLHEP::Hep3Vector &v)
Translate3D (double x, double y, double z)
TranslateX3D (double x)
TranslateY3D (double y)
TranslateZ3D (double z)
```

평행이동만을 수행하는 변환을 나타내고자 할 때, G4Translate3D 클래스를 사용할 수 있습니다. G4ThreeVector 객체가 있다면 이를 입력인자로 넣는 <b>G4Translate3D(v)</b>를 사용해도 되고, 혹은 x, y, z축으로의 평행이동 벡터의 값을 직접 입력하여 <b>G4Translate3D(x, y, z)</b>를 이용해도 됩니다.

만약 특정 축방향으로만 이동하는 경우에는 **G4TranslateX3D**, **G4TranslateY3D**, **G4TranslateZ3D**를 이용하여 좀 더 간단하게 표현할 수도 있습니다.

다음은 회전 관련 클래스입니다.

```cpp
Rotate3D (const CLHEP::HepRotation &mt)
Rotate3D (double a, const Vector3D< double > &v)
RotateX3D (double a)
RotateY3D (double a)
RotateZ3D (double a)
```

회전만을 수행하는 변환을 나타내고자 할 때, G4Rotate3D 클래스를 사용할 수 있습니다. G4RotationMatrix 객체가 있다면 이를 입력인자로 넣는 <b>G4Rotate3D(mt)</b>를 사용해도 되고, 혹은 회전 각도와 회전 축 벡터를 직접 입력하여 <b>G4Rotate3D(a, v)</b>를 이용해도 됩니다.

만약 특정 좌표축을 회전 축으로 삼아 회전하는 경우에는 **G4RotateX3D**, **G4RotateY3D**, **G4RotateZ3D**를 이용하여 좀 더 간단하게 표현할 수도 있습니다.

G4Transform3D 클래스를 상속받은 이 8가지 클래스는, 앞으로 설명할 <b>G4Transform3D 클래스의 함수 및 연산자를 동일하게 사용</b>할 수 있습니다.

### 회전성분, 평행이동성분

```cpp
CLHEP::HepRotation getRotation () const
CLHEP::Hep3Vector getTranslation () const
```

G4Transform3D 객체가 가진 회전성분 혹은 평행이동성분을 반환하는 함수입니다. 입력인자 없이 다음과 같이 이용할 수 있습니다.

```cpp
auto mt = G4RotationMatrix(G4ThreeVector(0., 0., 1.), 30. * deg);
auto v = G4ThreeVector(5. * cm, 0., 0.);
auto tr = G4Transform3D(mt, v);

auto mt2 = tr.getRotation(); // mt2 = mt
auto v2 = tr.getTranslation(); // v2 = v
```

### 연산자

```cpp
Transform3D operator* (const Transform3D &b) const
```

선형변환에 추가로 또 다른 선형변환을 가하여 새로운 선형변환을 얻는 연산입니다.

예를 들어, X축으로 3 cm 이동시키고, Z축으로 2 cm 이동시킨 뒤, X축방향을 기준으로 30° 회전하는 변환을 수행하는 선형변환을 만들고 싶다면 다음과 같이 작성하면 됩니다.

```cpp
auto tr1 = G4TranslateX3D(3. * cm); // Translate 3 cm along X-axis 
auto tr2 = G4TranslateZ3D(2. * cm); // Translate 2 cm along Z-axis 
auto tr3 = G4RotateX3D(30. * deg); // Rotate 30° around X-axis

// Translate 3 cm along X-axis (tr1), 
// then translate 2 cm along Z-axis (tr2), 
// and then finally rotate 30° around X-axis (tr3)
auto tr = tr1 * tr2 * tr3; 
```

---

## 정리

이번 글에서는 위치와 회전, 그리고 이를 한번에 표현할 수 있는 선형변환을 다루는 클래스에 대해 알아보았습니다.

다음 글에서는 이를 이용하여 지오메트리를 배치해보도록 하겠습니다.
