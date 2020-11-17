# WSL에서 libQt5 관련 "No such file or directory" 에러 해결


WSL로 설치된 Debian계열 리눅스에서 Qt5 기반 프로그램 실행 시, libQt5*.so 파일과 관련하여 발생하는 cannot access 오류를 해결하는 방법에 대해 알아봅니다.

<!--more-->


## TL;DR

다음 명령어 입력. (`/usr/lib/x86_64-linux-gnu/libQt5Core.so.5` 부분은 에러 문구에 나온 경로로 입력)

```bash
sudo strip --remove-section=.note.ABI-tag /usr/lib/x86_64-linux-gnu/libQt5Core.so.5
```



---



## 버그 설명

WSL로 설치된 Debian계열 리눅스에서 Qt5 기반 프로그램을 실행하려 할 때, Qt5 라이브러리를 apt 등을 통해 정상설치 하였음에도 불구하고, libQt5Core.so.5, libQt5Gui.so.5, ... 등 libQt5 관련 라이브러리에서 cannot access 오류가 발생하는 경우가 있습니다.



---



## 왜 발생하는가?

WSL로 설치된 Debian 계열 리눅스(Ubuntu 등)에 대해 [알려진 이슈](https://github.com/Microsoft/WSL/issues/3023)입니다.

내용이 어려워서 저도 전부 이해하지는 못했으나, 대강의 흐름은 이렇습니다.

- Qt5 tool에서 `lupdate`를 실행할 때, (`LD_DEBUG=all ldd /usr/lib/libQt5Xml.so` 등)
- `libQt5Core.so.5`를 정상적인 라이브러리로 인식하지 않는 문제가 발생함.
- `.note.ABI-tag`를 호출하는 ELF section이 존재하는 한, 이 라이브러리는 `ld-linux`링커로 직접 실행될 수는 있지만, 다른 shared object와 연동하여 링킹될 수 없음.
- 이를 해결하려면 `strip --remove-section=.note.ABI-tag /usr/lib/libQt5Core.so.5`와 같이 해당 라이브러리에서 ELF section을 제거해야 함.



---



## 해결방법

위에 설명한 바와 같이, `strip`이라는 명령어를 사용하여 해당 정보를 제거하면 됩니다.

맨 끝에 `/usr/lib/x86_64-linux-gnu/libQt5Core.so.5` 부분은 에러 문구에 출력된 라이브러리 경로를 입력합니다.

```bash
sudo strip --remove-section=.note.ABI-tag /usr/lib/x86_64-linux-gnu/libQt5Core.so.5
```



---



## Reference

https://github.com/YosysHQ/nextpnr/issues/375

https://superuser.com/questions/1347723/arch-on-wsl-libqt5core-so-5-not-found-despite-being-installed

https://github.com/Microsoft/WSL/issues/3023
