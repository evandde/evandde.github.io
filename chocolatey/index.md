# Windows용 패키지 관리자 Chocolatey(choco) 설치 및 이용하기


이 글에서는 Windows용 패키지 관리자인 Chocolatey(약칭: choco)를 설치하고 이용하는 방법에 대해 알아봅니다.
<!--more-->

{{< image src="featured.png" >}}

[Chocolatey](https://chocolatey.org/)는 Linux에서의 [apt(apt-get)](https://salsa.debian.org/apt-team/apt), [yum](http://yum.baseurl.org/index.html)이나 macOS에서의 [Homebrew](https://brew.sh/index_ko.html)처럼 패키지를 설치/업데이트/제거 등 관리하는 데에 사용하는 Windows용 프로그램입니다.

{{< admonition note >}}

Chocolatey로 프로그램의 설치/제거 등을 하실 때에는 **관리자 권한**으로 작업하셔야 합니다. 관리자 권한 없이 이용하려면 설치경로의 변경 등의 작업이 요구됩니다. 

(참고: https://chocolatey.org/install#non-administrative-install)

{{< /admonition >}}

---

## Chocolatey 설치하기

### 요구사항

- Windows 7+/ Windows Server 2003+
- Powershell v2+ (온라인 설치 시 v3+)
- .Net Framework 4+ (온라인 설치 시 4.5+)

### cmd.exe로 설치하기

1. cmd.exe를 관리자 권한으로 실행합니다.

2. 다음 명령줄을 실행합니다.

   ```cmd
   @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command " [System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
   ```

### PowerShell.exe로 설치하기

PowerShell로 설치할 때에는 실행 정책(Execution Policy)상 제한이 걸리지 않도록 설정하는 과정이 추가적으로 필요할 수 있습니다. 실행 정책에 관해서는 간단하게 `Bypass` 옵션을 사용하셔도 되고, 좀 더 보안을 신경쓰신다면 `AllSigned` 옵션을 사용하셔도 됩니다.

1. PowerShell.exe를 관리자 권한으로 실행합니다.

2. `Get-ExecutionPolicy` 명령어로 실행 정책을 확인합니다. 만약 `Restricted`가 출력된다면, `Set-ExecutionPolicy AllSigned` 나, `Set-ExecutionPolicy Bypass -Scope Process`를 입력하여 제한을 풀어줍니다.

3. 이제 다음의 명령줄을 실행합니다.

   ```powershell
   [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   ```
   

### 그 외의 방법으로 설치하기

[chocolatey 공식 홈페이지를 참고](https://chocolatey.org/docs/installation#more-install-options)하세요.



---



## Chocolatey 이용하기

### 패키지 검색하기

choco로 설치 가능한 전체 패키지 목록은 https://chocolatey.org/packages에서 확인할 수 있습니다.

혹은, cmd나 PowerShell에서 `choco search` 명령어로 검색이 가능합니다.

```powershell
choco search 검색할내용
```

{{< image src="choco_search.png" title="notepad를 검색해보았습니다" width=100% >}}

추가적으로 다음과 같은 옵션을 사용할 수도 있습니다.

- 검색할내용과 정확하게 일치하는 항목만 출력하기: `-e` (`--exact`)
- 패키지에 대한 자세한 정보 출력하기: `--detailed`
- 현재 컴퓨터에 설치된 패키지 목록 출력하기: `-l` (`--local`) ([아래(설치한 패키지 목록 보기)]({{< ref "chocolatey/#설치한-패키지-목록-보기" >}}) 참고)



### 패키지 설치하기

`choco install` 명령어를 통해 패키지를 설치할 수 있습니다.

```powershell
choco install 패키지이름
```

추가적으로 다음과 같은 옵션을 사용할 수도 있습니다.

- 설치 시 확인여부를 묻는 내용을 띄우지 않고 무조건 수락하기: `-y`
- 특정 버전을 설치하기: `--version 버전번호` (예: `choco install python --version 3.8.5`)







### 설치한 패키지 목록 보기

`choco search` 명령어 뒤에 `-l`옵션을 쓰면, 현재 이 컴퓨터에 설치된 목록을 출력해줍니다.

```powershell
choco search -l
```





### 패키지 삭제하기

`choco uninstall` 명령어를 통해 설치한 패키지를 삭제할 수 있습니다.

```powershell
choco uninstall 패키지이름
```







### 패키지 업그레이드하기

`choco upgrade` 명령어를 통해 설치한 패키지를 업그레이드할 수 있습니다.

```powershell
choco upgrade 패키지이름
```

`choco upgrade chocolatey` 명령어를 입력하면, chocolatey도 최신화할 수 있습니다.

`choco upgrade all` 명령어를 입력하면, 현재 컴퓨터에 설치된 모든 패키지(chocolatey 포함)를 최신화할 수 있습니다.



---



## Reference

https://chocolatey.org/

https://github.com/chocolatey/choco/wiki

https://chocolatey.org/docs/commands-reference
