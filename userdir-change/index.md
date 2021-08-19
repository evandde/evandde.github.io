# 사용자 폴더의 위치를 변경하는 방법


Windows를 설치하면, `C:\Users\사용자이름` 폴더에 **다운로드, 사진, 문서, 동영상** 등의 폴더가 있는 것을 확인할 수 있습니다. 이러한 폴더를 **사용자 폴더** 라고 합니다. 
이 글에서는 사용자 폴더의 위치를 변경하는 방법에 대해 알아봅니다.

<!--more-->

{{< image src="featured.png" width=30% >}}

사용자 폴더는 대개 응용프로그램(MS Office, Visual Studio, ...) 자체가 설치되는 공간이 아니라, 우리가 컴퓨터를 사용하는 과정에서 생성되는 <b>여러가지 데이터(*.txt, *.docx, *.pptx, ...)들이 저장되는 공간</b>입니다. 그렇기 때문에, 컴퓨터를 사용하다보면 이러한 사용자 폴더가 차지하는 용량이 점점 늘어나게 됩니다.

사용형태에 따라, C드라이브에는 적은 용량을 할당하여 윈도우와 응용프로그램을 설치하고, D드라이브에 많은 용량을 할당하여 데이터를 저장하고 백업하는 용도로 파티션 관리를 하는 분들도 꽤 있으리라 생각합니다. 이런 분들이라면 더욱, 사용자 폴더를 D드라이브로 변경하는 편이 용량 측면 및 백업·관리 측면에서 유리할 것입니다.

이 글에서는 사용자 폴더를 임의의 경로로 옮기는 몇 가지 방법을 살펴볼 것입니다.



---



## TL;DR

### 개별 폴더마다 경로 변경을 간단하게 수행하고자 하는 경우

{{< admonition warning >}}

일부 폴더는 이 절차를 적용할 수 없거나, 적용되더라도 의도대로 동작하지 않을 수 있습니다. 자세한 사항은 아래의 [개별 폴더 경로변경의 문제점]({{< ref "userdir-change#문제점" >}})을 참고하세요.

{{< /admonition >}}

1. 사용자 폴더가 있는 위치로 이동.
   1. [WIN]+[R]을 눌러 **실행** 창 띄우기.
   2. `%UserProfile%`을 입력하고 확인을 눌러 사용자 폴더 위치의 파일 탐색기 띄우기.
2. 옮기고 싶은 사용자 폴더에서 <b>우클릭 - 속성</b>.
3. **위치** 탭으로 이동.
4. 값을 원하는 경로로 변경.
5. 확인.

{{< image src="user_folder_path_setting.png" width=50% >}}

### Windows 설치 과정 중에 설정하는 법

{{< admonition danger >}}

실수하지 않도록 각 단계를 차근차근 진행하세요. 작업이 정상적으로 이루어지지 않은 경우, 로그인이 되지 않거나, 최악의 경우 Windows를 다시 설치해야 할 수도 있습니다.

{{< /admonition >}}

1. Windows 설치 과정 중, **국가 선택창**이 뜨면 <b>[CTRL]+[SHIFT]+[F3]</b>을 눌러 audit mode로 진입.

2. Windows 데스크탑 화면이 뜬 뒤, System Preperation Tool 대화상자가 나타나면 Cancle버튼을 눌러 끔.

4. **디스크 관리**를 실행하여 사용자 폴더를 위치시키고자 하는 드라이브 문자 확인.
   
   1. [WIN]+[R]을 눌러 실행 창 띄우기.
   2. `diskmgmt.msc`을 입력하고 확인을 눌러 디스크 관리 띄우기.
   3. 파일 시스템이나 용량 등 정보를 바탕으로, 사용자 폴더를 위치시킬 드라이브의 문자 확인.
   
4. 아래 내용으로 unattended answer file 생성. (인터넷 연결이 가능하므로, 이 블로그에서 아래 내용을 복사-붙여넣기 가능)

   1. 메모장 실행.

   2. 다음 `XML` 내용 입력. (4번 줄과 6번 줄 내용을 본인에 맞게 수정)

      ```xml {hl_lines=[4,6]}
      <?xml version="1.0" encoding="utf-8"?>
      <unattend xmlns="urn:schemas-microsoft-com:unattend">
      <settings pass="oobeSystem">
      <component name="Microsoft-Windows-Shell-Setup" processorArchitecture="amd64" publicKeyToken="31bf3856ad364e35" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <FolderLocations>
      <ProfilesDirectory>D:\Users</ProfilesDirectory>
      </FolderLocations>
      </component>
      </settings>
      </unattend>
      ```

      - 4번 줄: <font color="red">processorArchitecture</font> 변수의 값은 64 bit 윈도우를 설치할 경우에는 <font color="red">amd64</font>로 (프로세서 종류가 Intel / AMD 중 어느 것인지는 관계 없음), 32 bit 윈도우를 설치할 경우에는 <font color="red">x86</font>로 입력.
      - 6번 줄: <font color="red">ProfilesDirectory</font> 태그의 값은 사용할 <font color="red">사용자 폴더의 위치</font>로 설정. 이 글에서는 D드라이브로 변경할 것을 상정하여, <font color="red">D:\Users</font>로 설정하였음.

   3. **C드라이브를 제외한 아무 드라이브의 최상위 위치**에 `relocate.xml`로 저장.

5. **관리자 권한**으로 **cmd**를 켜고 다음 명령어 두 줄 실행. (2번 줄의 `/unattend` 항목은 위에서 저장한 `relocate.xml`의 경로를 입력)

   ```powershell {linenos=table,hl_lines=[2]}
   net stop WMPNetworkSvc
   %windir%\system32\sysprep\sysprep.exe /oobe /reboot /unattend:d:\relocate.xml
   ```

6. 재부팅되는 것을 기다린 뒤 Windows 설치를 마저 진행하면 완료.



---



## 용어 설명

환경변수 `UserName`: 현재 로그인한 Windows 계정의 사용자명입니다.

환경변수 `UserProfile`: 현재 로그인한 Windows 계정의 사용자 폴더 경로입니다. 기본값은 `C:\Users\%UserName%` 입니다.



---



## 개별 폴더 경로만 변경

사용자 폴더 경로로 들어가 봅시다. <b>[WIN]+[R]</b>을 눌러 실행 창을 열고, `%UserProfile%`라고 입력하면 됩니다. (기본적으로 `C:\Users\%UserName%` 입니다) 

그러면 다음과 같은 탐색기 창이 뜰 것입니다.

{{< image src="user_folders.png" width=70% >}}

여기서 보이는 3D 개체, 검색, 다운로드, 동영상, ... 이런 폴더들은 사실 일종의 단축아이콘 같은 녀석들입니다. 예를 들어 **3D 개체**라는 아이콘은 사실 `C:\Users\%UserName%\3D Objects`와 같은 경로로 연결해주는 바로가기의 역할을 하지요. 그러므로, 이 바로가기의 경로만 변경해주면 됩니다.

### 변경 방법

1. 옮기고 싶은 폴더의 바로가기에서 <b>우클릭 - 속성</b>.

   {{< image src="user_folder_properties.png" width=50% >}}

2. **위치** 탭으로 이동.

3. 값을 원하는 경로로 변경.

4. 확인.

{{< image src="user_folder_path_setting.png" width=50% >}}

{{< admonition info >}}

이미 해당 폴더 안에 데이터가 들어있다면, 확인을 눌렀을 때 그 데이터들을 새로운 경로로 이동할지의 여부를 묻는 알림 창이 뜹니다. 원하는 방식에 따라 선택하시면 됩니다.

{{< /admonition >}}

### 문제점

이 방법은 3D 개체, 검색, 다운로드, 동영상, ... 로 정의되어 있는 **바로가기의 경로를 변경하는 방법**입니다. 예를 들어 "문서" 라는 바로가기의 경로를 `C:\Users\%UserName%\Documents`에서 `D:\Users\%UserName%\Documents`로 변경하는 것이죠. 

<b>문제는, 우리가 이처럼 "문서"라는 바로가기를 변경해도, `%UserProfile%`이라는 환경변수는 그대로 `C:\Users\%UserName%`값을 가지고 있다는 것입니다.</b>

일부 프로그램은, "문서"라는 폴더에 데이터를 저장하려고 접근할 때, "문서"라는 바로가기를 활용하지 않고 `%UserProfile%\Documents`라는 경로를 활용하는 경우가 있습니다. 이런 프로그램은, 우리가 "문서"라는 바로가기를 D로 옮겨놓아도, 이를 무시하고 `%UserProfile%\Documents`(`C:\Users\%UserName%\Documents`) 폴더를 새로 만들어버린 뒤 그 안에 데이터를 저장합니다. 이러면 "문서" 폴더가 C드라이브와 D드라이브에 따로따로 생기고, 더욱 복잡해지는 결과를 초래하지요.

또 다른 문제도 있습니다. `%UserProfile%` 폴더 안에는, 우리가 위치를 바꿀수 없는 폴더들도 존재합니다. 대표적인 예가 `AppData` 폴더입니다(기본적으로 숨김처리 되어있는 폴더입니다).  어떤 프로그램들은 그 프로그램의 환경설정 내용 등을 `AppData` 폴더에 저장하는 경우가 있습니다. 그런데, 이 폴더는 위에서 설명한 방법으로는 위치를 변경할 수 없습니다.



---



## 환경변수 UserProfile 변경하기

앞서의 문제를 해결하려면, <b>`%UserProfile%` 환경변수 자체를 D드라이브로 바꾸면 됩니다</b>...만, 이 작업은 쉬운 일이 아닙니다.

{{< admonition danger >}}

이 작업은 실수의 여지가 많고, 난이도가 높습니다. 

작업이 정상적으로 이루어지지 않은 경우, 로그인이 되지 않거나, 최악의 경우 Windows를 다시 설치해야 할 수도 있습니다.

{{< /admonition >}}

### Windows 재설치 없이 변경하는 법

<font color='red'>이 방법은 저도 아직 성공해본 적이 없습니다.</font> 10회 이상 계정을 삭제하고 다시 만들고 Windows를 재설치하고 하며 시도하였지만, 성공하지 못했습니다.  (물론 제가 해당 방법에 대한 이해가 부족했기 때문일 수 있습니다)

이 작업을 통해 `%UserProfile%`을 변경하면 내부적으로 어딘가에서 꼬이는 것 같았습니다. 변경 후에 기존 계정으로 로그인하면, 로그인 하자마자 혹은 시작 버튼을 누르자마자 다음과 같은 에러가 발생하였습니다.

{{< image src="error.png" >}}

때문에, 참고하였던 관련 링크와 함께 간단한 부연설명만 하고 넘어가겠습니다.



사용자 폴더를 이동하는 방법에 관해 구글링을 해보면 꽤나 많은 정보가 나옵니다. 핵심적인 흐름을 요약하면 다음과 같습니다.

1. 관리자 계정을 활성화
2. 기존 계정을 로그아웃하고 관리자 계정으로 로그인
3. 레지스트리 변경을 통해 `%UserProfile%` 환경변수를 변경
4. 관리자 계정을 로그아웃하고 기존 계정으로 다시 로그인
5. 관리자 계정을 비활성화

대표적으로 제가 참고하였던 링크입니다.

- [Windows10에서 사용자 폴더의 이름을 변경하는 방법 (C:\Users\Username)](https://itrainbowm.tistory.com/29)
- [Windows 7, 사용자 폴더 위치를 변경하는 방법](https://wisebee.tistory.com/13) (이론상 Windows 10에서도 동일하게 적용 가능합니다)



**내용 추가**

새로운 방법을 찾게되어 내용을 추가합니다. 제가 시도해보지는 않았지만 뭔가 가능할 것 같은 느낌이 듭니다. 다음에 기회가 되면 시도해보도록 하겠습니다.

- [윈도우 10에서 C:\사용자 (실제명 : C:\Users) 폴더를 다른 드라이브(ssd, hdd)로 옮기는 방법](https://ks2colorworld.tistory.com/13)



---



### Windows 설치 시 초기 설정을 통해 변경하는 법

저는 결국 이 방법을 통해 사용자 폴더의 위치를 변경하였습니다. 이 방법을 요약하면 다음과 같습니다.

1. Windows를 설치할 때 oobe[^1]단계에서 audit 모드[^2]에 진입.
2. 사용자 폴더를 변경한다는 내용이 담긴 unattended answer file[^3]을 생성.
3. 2에서 생성한 unattended answer file을 참고하여 Windows를 설치.



#### Windows 재설치

ISO 파일을 이용하여 제작한 부팅디스크도 좋고, Windows에서 기본적으로 제공하는 PC 초기화 기능을 이용해도 좋습니다.

#### Audit 모드 진입

드라이브 초기화가 진행된 뒤, 재설치가 시작되면 다음 그림과 같은 <b>국가/언어 선택창</b>이 뜹니다. 여기서 <b>[CTRL]+[SHIFT]+[F3]</b>을 눌러 audit 모드로 진입합니다.

{{< image src="oobe_phase.png" width=100% >}}

#### Windows 부팅 후 Sysprep 창 종료

자동으로 PC가 재부팅된 뒤, audit 모드로 진입할 것입니다. 윈도우 데스크탑이 뜬 뒤 다음과 같은 System Preparation Tool 창이 뜰텐데, 지금은 **Cancle 버튼을 눌러 종료**해 줍니다.

{{< image src="sysprep_cancle.png" width=40% >}}

#### 디스크 관리에서 사용자 폴더를 둘 드라이브명 확인

일반적으로 D드라이브라고 생각하고 있을지라도, audit 모드에서는 드라이브명이 다르게 부여되어 있을 수 있습니다. <font color='red'>반드시 디스크 관리를 열어 용량 정보 등을 보고 사용자 폴더를 위치시킬 드라이브의 드라이브명이 무엇인지 확인하세요.</font>

1. [WIN]+[R]을 눌러 실행 창을 띄움.
2. `diskmgmt.msc`를 입력하고 실행하여 디스크 관리 창 띄움.
3. 용량 정보, 파일 시스템 등을 토대로, 사용자 폴더를 위치시킬 드라이브의 <b>드라이브명(알파벳)</b>이 무엇인지 확인.

#### Unattended answer file 생성

이 시점에서는 인터넷 연결이 가능합니다. <font color='red'>실수를 줄이기 위해, 아래의 xml 코드를 직접 입력하지 마시고, 복사-붙여넣기한 뒤 필요한 부분만 수정하시길 권장합니다.</font>

다음의 과정을 통해 unattended answer file을 생성합니다.

1. 메모장 실행.

2. 다음 `XML` 내용 입력. 단, 4번 줄과 6번 줄의 내용은 본인에 맞게 수정.

   ```xml {hl_lines=[4,6]}
   <?xml version="1.0" encoding="utf-8"?>
   <unattend xmlns="urn:schemas-microsoft-com:unattend">
   <settings pass="oobeSystem">
   <component name="Microsoft-Windows-Shell-Setup" processorArchitecture="amd64" publicKeyToken="31bf3856ad364e35" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <FolderLocations>
   <ProfilesDirectory>D:\Users</ProfilesDirectory>
   </FolderLocations>
   </component>
   </settings>
   </unattend>
   ```

   - 4번 줄: <font color="red">processorArchitecture</font> 변수의 값은 64 bit 윈도우를 설치할 경우에는 <font color="red">amd64</font>로 (프로세서 종류가 Intel / AMD 중 어느 것인지는 관계 없음), 32 bit 윈도우를 설치할 경우에는 <font color="red">x86</font>로 입력.
   - 6번 줄: <font color="red">ProfilesDirectory</font> 태그의 값은 사용할 <font color="red">Users 폴더의 위치</font>로 설정. 이 글에서는 D드라이브로 변경할 것을 상정하여, <font color="red">D:\Users</font>로 설정하였음.

3. C드라이브를 제외한 아무 드라이브의 최상위 위치에 `relocate.xml`로 저장. 
   <font color='red'>반드시, 저장 시 파일 형식을 <b>모든 파일(All files)</b>로 선택</font>하여 txt 형태로 저장되지 않도록 주의.

   {{< image src="save_relocatexml.png" width=70% >}}

#### 생성한 unattended answer file을 이용하여 설치 진행

우선 관리자 권한으로 cmd를 켭니다.

1. [WIN]+[R]을 눌러 실행 창을 띄움.
2. `cmd`를 입력하고, <b>[CTRL]+[SHIFT]+[ENTER]</b>을 눌러 관리자 권한으로 실행.

이어서, cmd창에 다음 명령어 두 줄을 입력합니다. 단, 2번 줄의 /unattend 항목은 위에서 저장한 relocate.xml의 경로로 입력합니다.

   ```powershell {linenos=table,hl_lines=[2]}
   net stop WMPNetworkSvc
   %windir%\system32\sysprep\sysprep.exe /oobe /reboot /unattend:d:\relocate.xml
   ```

다음과 같은 창이 뜬 뒤, 자동으로 재부팅될 것입니다. 이어서 Windows 설치를 진행하시면 됩니다.

{{< image src="sysprep.png" width=30% >}}



긴 과정을 따라오시느라 고생하셨습니다.

정상적으로 진행되었다면, 사용자 폴더들이 원하는 드라이브에 생성되어 있을 것입니다.



---



## Reference

https://itrainbowm.tistory.com/29

https://wisebee.tistory.com/13

https://www.tenforums.com/tutorials/1964-move-users-folder-location-windows-10-a.html

https://ks2colorworld.tistory.com/13





[^1]: Out-of-Box Experience의 약자로, 새로 설치된 Windows 제품을 처음 사용할 때의 단계를 의미.
[^2]: Windows에 내장된 관리자 계정 모드로, 설치 시점에서 다양한 설정을 할 수 있게 해줌.
[^3]: Windows의 설치 과정에서 사용할 설정 값이나 변수 등을 기록한 xml형식의 파일.
