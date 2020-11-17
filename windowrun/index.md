# Windows 실행([WIN]+[R]) 명령어 정리


이 글에서는 <b>시작-실행</b> 혹은 단축키 <b>[WIN]+[R]</b>을 통해 띄울 수 있는 실행 창에서 사용 가능한 다양한 명령어를 정리해 봅니다.

<!--more-->


{{< image src="featured.png" >}}

---



## 사용법

### 기본적인 사용

1. 실행 창을 띄웁니다. (<b>시작-실행</b> 혹은 단축키 <b>[WIN]+[R]</b>)
2. <b>열기(<u>O</u>):</b> 라고 표시된 상자 안에 명령어를 입력합니다. (대소문자는 상관 없습니다)
3. 확인을 누릅니다. (혹은 <b>[ENTER]</b>를 누릅니다.)

### 관리자 권한으로 실행

어떤 명령어든, 위의 사용법 설명에서 확인을 누르는 대신, <b>[CTRL]+[SHIFT]+[ENTER]</b>를 누르면, 해당 명령어가 **관리자 권한으로 실행**됩니다.

주로 cmd나 powershell 등을 관리자권한으로 실행하고 싶을 때 사용하면 좋습니다.



---



## 응용프로그램 명령어

| 명령어&nbsp;&nbsp;&nbsp;&nbsp;     | 결과&nbsp;&nbsp;&nbsp;&nbsp;      |
| ---------- | ---------- |
| calc       | 계산기    |
| cmd        | 커맨드 창 |
| mspaint    | 그림판    |
| notepad    | 메모장    |
| powershell | 파워셸    |



---



## 환경변수로 정의된 폴더명

| 명령어               | 결과                                                         |
| -------------------- | ------------------------------------------------------------ |
| %AppData%            | 현재 로그인한 사용자계정 폴더 내에 숨김처리된 AppData\Roaming\ 폴더 (일반적으로 C:\\Users\\<계정명>\\Appdata\\Roaming\\) |
| %LocalAppData%       | 현재 로그인한 사용자계정 폴더 내에 숨김처리된 AppData\Local\ 폴더 (일반적으로 C:\\Users\\<계정명>\\Appdata\\Local\\) |
| %ProgramData%        | ProgramData 폴더 (일반적으로 C:\\ProgramData\\)              |
| %ProgramFiles%       | Program Files 폴더 (일반적으로 C:\\Program Files\\)          |
| %ProgramFiles(x86)%  | Program Files (x86) 폴더. 64 bit 전용 (일반적으로 C:\\Program Files (x86)\\) |
| %UserProfile%        | 현재 로그인한 사용자계정 폴더 (일반적으로 C:\\Users\\<계정명>\\) |
| %WinDir%             | Windows 폴더 (일반적으로 C:\\Windows\\)                      |
| shell:Startup        | 현재 사용자의 시작프로그램 폴더                              |
| shell:Common Startup | 모든 사용자를 위한 시작프로그램 폴더                         |



---



## Windows 시스템

| 명령어            | 결과                                       |
| ----------------- | ------------------------------------------ |
| appwiz.cpl        | 프로그램 제거 또는 변경                    |
| cleanmgr          | 디스크 정리                                |
| compmgmt.msc      | 컴퓨터 관리                                |
| control           | 제어판                                     |
| desk.cpl          | 디스플레이 설정                            |
| devmgmt.msc       | 장치 관리자                                |
| diskmgmt.msc      | 디스크 관리                                |
| dxdiag            | Direct X 진단 도구                         |
| firewall.cpl      | 방화벽                                     |
| mmsys.cpl         | 사운드 및 오디오 등록정보                  |
| mrt               | 악성 소프트웨어 제거 도구                  |
| mstsc             | 원격 데스크탑 연결                         |
| mstsc /v <IP주소> | IP 주소를 명시하여 원격 데스크탑 연결 실행 |
| ncpa.cpl          | 네트워크 연결 정보                         |
| optionalfeatures  | Windows 기능 켜기/끄기                     |
| perfmon.msc       | 성능 모니터 뷰                             |
| powercfg.cpl      | 전원 옵션                                  |
| regedit           | 레지스트리 편집기                          |
| services.msc      | 서비스                                     |
| sndvol            | 볼륨 Mixer                                 |
| sysdm.cpl         | 시스템 속성                                |
| taskmgr           | Windows 작업 관리자                        |
| taskschd.msc      | 작업 스케줄러                              |
| winver            | Windows 버전 정보                          |

