# Geant4 UI command - 반복문


Geant4 UI command에서 활용 가능한 반복문. "/control/loop"와 "/control/foreach"에 대해 알아봅니다.

<!--more-->

## 개요

Geant4에서 built-in UI command로 제공하는 반복문은 두 가지입니다.

- /control/loop
- /control/foreach

이 반복문의 중요한 특징은 "**다른 매크로파일을 반복적으로 실행시킨다**"는 점입니다.

각각의 용법과 함께 좀 더 자세히 살펴보겠습니다.

---



## /control/loop

`/control/loop` 반복문은 대개의 프로그래밍 언어가 제공하는 for문과 유사합니다.

**시작**, **끝**, **간격**을 입력하여 **카운터를 증감**시키며 **다른 매크로파일을 실행**시켜줍니다.

### 사용법

`/control/loop 매크로파일명 카운터변수명 시작값 끝값 간격`의 형태로 입력합니다.

이 때, `매크로파일명`과 `카운터변수명`은 문자열(string)로 인식하고, `시작값`, `끝값`, `간격`은 실수형(double)으로 인식합니다.

이렇게 입력하면, `매크로파일`에서 `카운터변수`를 `시작`~`끝`값으로 aliasing 시켜줍니다. 즉, `매크로파일` 내에서는 `{카운터변수}`와 같이 입력하면 되는 것이죠.

{{< admonition note >}}

`간격` 값은 생략 가능합니다. 생략할 경우 기본값으로 **1**이 사용됩니다.

{{< /admonition >}}

### 사용예시

다음과 같은 매크로를 만들어봅시다.

```bash
/gun/energy 10. MeV
/run/beamOn 10000

/gun/energy 12. MeV
/run/beamOn 10000

/gun/energy 14. MeV
/run/beamOn 10000

/gun/energy 16. MeV
/run/beamOn 10000

/gun/energy 18. MeV
/run/beamOn 10000

/gun/energy 20. MeV
/run/beamOn 10000
```

여기서 에너지 값이 10~20으로 2씩 바뀌고 있을 뿐, 나머지는 반복됩니다.

이 경우 다음과 같이 두 개의 파일로 나누어 작성하면 동일하게 동작합니다.

```bash
# 주 매크로파일의 내용
/control/loop myRun.mac ene 10. 20. 2.
```

```bash
# myRun.mac의 내용
/gun/energy {ene} MeV
/run/beamOn 10000
```



---



## /control/foreach

`/control/foreach` 반복문은 대개의 프로그래밍 언어가 제공하는 range-based for문과 유사합니다.

**카운터**를 **제시된 목록의 각 값**으로 바꾸어가며 **다른 매크로파일을 반복적으로 실행**합니다.

### 사용법

`/control/foreach 매크로파일명 카운터변수명 "반복할값목록"`의 형태로 입력합니다.

여기서 `"반복할값목록"`을 <font color=red>입력할 때 주의점</font>이 두 가지 있습니다.

- 목록 전체를 반드시 ""(double-quote)로 감쌀 것
- 목록의 각 값은 띄어쓰기로 구분할 것

이렇게 입력하면, `매크로파일`에서 `카운터변수`를 `"반복할값목록"`에 적힌 각각의 값으로 aliasing 시켜줍니다. 즉, `매크로파일` 내에서는 `{카운터변수}`와 같이 입력하면 되는 것이죠.

### 사용예시

다음과 같은 매크로를 만들어 봅시다.

```bash
/gun/particle p
/run/beamOn 10000

/gun/particle e-
/run/beamOn 10000

/gun/particle e+
/run/beamOn 10000

/gun/particle gamma
/run/beamOn 10000
```

여기서는 입자가 p, e-, e+, gamma로 바뀌고 있을 뿐, 나머지는 반복됩니다.

이 경우 다음과 같이 두 개의 파일로 나누어 작성하면 동일하게 동작합니다.

```bash
# 주 매크로파일의 내용
/control/foreach myRun.mac pname "p e- e+ gamma"
```

```bash
# myRun.mac의 내용
/gun/particle {pname}
/run/beamOn 10000
```


