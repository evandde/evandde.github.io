# Geant4의 UI Command 기초 이론


Geant4는 UI command라는 개념을 통해 C++ 언어로 하드코딩 하지 않고도 시뮬레이션 전반을 핸들링하거나 모니터링할 수 있도록 합니다. 이 글에서는 Geant4의 UI Command 사용에 대한 기초 이론을 다룹니다.

<!--more-->

---

## UI Command 개념

Geant4는 시뮬레이션 이전, 도중, 이후에 시뮬레이션의 조건 등을 조작하거나 정보를 추출하는 등의 다양한 기능을 수행할 수 있도록 UI Command라는 기능을 제공합니다.

UI Command는 Geant4에서 **기본적으로 제공**하는 **built-in command**와, **사용자가 직접 만들어 사용**하는 **messenger 기반 command**로 구분할 수 있습니다. 둘 다 사용방법과 기본 이론은 동일합니다.

### Built-in Command 일람

Built-in command 목록을 확인하는 방법을 소개합니다.

- 공식 홈페이지에서 제공하는 [웹페이지](https://geant4-userdoc.web.cern.ch/UsersGuides/ForApplicationDeveloper/html/Control/AllResources/Control/UIcommands/_.html)

- Qt 기반 GUI 형식으로 Geant4 어플리케이션을 실행한 뒤 **왼쪽 부분의 Help 탭** 확인

  {{< image src="qtui-help.png" width=100% >}}

---

## UI Command의 구성

### 기본 요소

UI Command는 다음의 세 가지로 구성됩니다.

- <font color=blue>Command directory</font>
- <font color=green>Command</font>
- <font color=red>Parameter(s)</font>

실제 예시는 다음과 같습니다.

- /<font color=blue>run</font>/<font color=green>verbose</font> <font color=red>1</font>
- /<font color=blue>vis</font>/<font color=blue>viewer</font>/<font color=green>flush</font>

여기서 <font color=red>Parameter(s)</font>가 여러 개 사용될 경우 각각을 구분하는 구분자는 **공백**입니다.

{{< admonition note >}}

공백이 있는 string을 파라미터로 사용해야 하는 경우에는, ""(double-quote)로 묶어줍니다.

{{< /admonition >}}

### 주석

각 줄마다, `#` 표시 이후는 주석처리됩니다.

예를 들면 다음과 같습니다.

```bash
# 이런 줄은 주석처리됩니다.
/run/verbose 1
/run/verbose 2 # /run/verbose 2는 인식되지만, #표시 이후는 주석입니다.
```

---

## UI Command의 입력

UI Command는 다음의 방법을 통해 입력 가능합니다.

- C++ 코드 상에서 직접 입력

- 외부 파일을 통한 입력

- 프로그램 실행 후, (G)UI 명령줄을 통한 입력

### C++ 코드 상에서 입력하기

G4UImanager라는 클래스가 관련 기능을 담당합니다. 

이 클래스는 singleton 형태로 짜여있으며, GetUIpointer()라는 static 멤버함수를 통해 클래스 객체를 가져올 수 있습니다.

멤버함수 중 ApplyCommand() 함수를 활용하면 UI command를 실행할 수 있습니다.

이 함수의 원형은 G4int ApplyCommand(const G4String& aCommand)로, 문자열을 입력으로 받고, 실행 결과를 정수값으로 반환합니다.

사용 예시는 다음과 같습니다.

  ```c++
G4UImanager::GetUIPointer()->ApplyCommand("/run/verbose 1");
  ```

{{< admonition note >}}

ApplyCommand() 함수는 정상 실행 시 `0`을 반환하고, 오류가 있을 시 `xyy`형태의 양의 정수로 오류코드를 반환합니다. `x`는 G4UIcommandStatus.hh의 enum에 정의된 값이고, `yy`는 문제를 일으킨 첫 parameter의 번호입니다. 다음은 10.7 버전의 G4UIcommandStatus 클래스에서 발췌한 내용입니다.

```c++
enum G4UIcommandStatus
{
  fCommandSucceeded         = 0,
  fCommandNotFound          = 100,
  fIllegalApplicationState  = 200,
  fParameterOutOfRange      = 300,
  fParameterUnreadable      = 400,
  fParameterOutOfCandidates = 500,
  fAliasNotFound            = 600
};
```

{{< /admonition >}}

{{< admonition warning >}}

ApplyCommand() 함수로 UI command 실행을 시도하였다가 모종의 문제로 인해 **실행을 실패하더라도**, **프로그램은 아무런 알림 없이 그냥 진행됩니다**. 필요하다면 코드 작성 시 반환되는 오류코드 값에 따라 대응하도록 **직접** 코딩해주셔야 합니다.

{{< /admonition >}}

### 외부 파일을 통한 입력

**대부분의 경우** UI command는 이 방법을 통해 입력됩니다.

이 방식을 이용하기 위해서는, 사용할 UI command를 ASCII 형태로 입력해 둔 파일이 필요합니다. 이 파일을 일반적으로 **매크로파일**이라고 부릅니다.

이 방법의 가장 큰 장점은 **소스코드를 다시 컴파일하지 않고도 수정 가능**하다는 점입니다. 

특정 인자를 약간씩 바꿔가며 여러 번 시뮬레이션을 돌려야하는 등의 작업을 수행할 때, 컴파일을 한 번만 해서 실행파일을 생성한 뒤 매크로파일만 수정하며 손쉽게 여러 조건의 시뮬레이션을 돌릴 수 있게 됩니다.

사용을 위해서는 두 가지 준비가 필요합니다.

1. 소스코드에서 매크로 파일을 사용하겠다는 선언 (UI command 중 `/control/execute 매크로파일명` 이용)

   ```c++
   G4UImanager::GetUIPointer()->ApplyCommand("/control/execute run.mac");
   // run.mac은 예시입니다. 실제 사용할 파일 이름으로 변경하면 됩니다.
   ```

   

2. 매크로파일 작성

   ```bash
   # run.mac 파일 내용
   # #표시 이후는 주석으로 인식됩니다.
   /run/verbose 1
   /tracking/verbose 1
   
   # 빈 줄도 넣을 수 있습니다.
   
   # 다른 매크로파일을 여기서 또 불러올 수도 있습니다.
   /control/execute run2.mac
   
   /run/beamOn 100
   ```

   

매크로파일을 사용할 때의 주의사항은 다음과 같습니다.

- 매크로파일 내의 내용 중 실행할 수 없는 명령줄을 만나면, `COMMAND NOT FOUND` 경고문구가 발생하고 해당 매크로파일을 읽는 작업을 중단한 뒤 건너뜁니다.

- 매크로파일에 사용되는 명령어는 full-path로 작성해야 합니다. 다음은 <font color=red>잘못된 사용 예</font>입니다.

  ```bash
  # 다음과 같은 명령어는 사용할 수 없습니다.
  cd /run/
  verbose 1
  ```

- 매크로파일의 경로가 프로그램 실행파일의 경로와 다를 경우, 경로까지 입력해줘야 합니다.

  ```c++
  // 실행파일의 상위디렉토리에 매크로파일이 있다면 이렇게 입력합니다.
  G4UImanager::GetUIPointer()->ApplyCommand("/control/execute ../run.mac");
  ```

### (G)UI 명령줄을 통한 입력

프로그램을 실행한 뒤, GUI 혹은 UI 상에서 직접 명령줄을 통해 입력할 수도 있습니다.

여기에서는 마치 linux 상에서 디렉토리를 탐색하듯, `cd` 명령어와 `ls` 명령어 등도 이용 가능합니다.

다음은 가장 많이 사용되는 Qt 기반 GUI에서 UI command를 입력하는 모습입니다.

{{< image src="qtui-session.png" width=100% >}}


