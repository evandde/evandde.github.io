# PowerShell에서 git log, diff 출력 시 한글 깨지는 오류 해결


PowerShell에서 git log나 git diff 출력 시 인코딩 문제로 인해 글자가 깨져 나오는 경우가 있습니다. 이 문제를 해결하는 방법을 알아봅니다.

<!--more-->

## TL;DR
**Git 설정을 변경하거나, 혹은 PowerShell 설정을 변경하거나. 둘 중 하나만 해도 고쳐집니다.**

**방법 1. Git 설정을 변경**

Git의 출력 설정을 변경합니다. 이 방법은 Git의 설정만을 변경하므로, Git에 한해서만 문제가 해결됩니다. PowerShell은 건드리지 않으므로, 동일한 문제가 다른 프로그램에서도 발생한다면 그 부분은 고쳐지지 않을 것입니다.

```powershell
git config --global core.pager 'less --raw-control-chars'
```

**방법 2. PowerShell 설정을 변경**

Powershell에서 환경변수를 설정합니다. 이는 해당 PowerShell창에 한해 일시적으로 문제를 해결합니다.

```powershell
$env:LC_ALL='C.UTF-8'
```

Powershell을 켤 때 자동실행되는 스크립트에 환경변수를 설정하는 내용을 적습니다. 이는 새로운 PowerShell 창이 켜질때마다 해당 PowerShell 창에 환경변수를 설정하므로, 영구적으로 문제를 해결해줍니다.

```powershell {linenos=table}
Set-ExecutionPolicy unrestricted
if(!(Test-Path -path $profile)){ New-Item -Type File -Path $profile -Force }
Add-Content -Path $profile -Value '$env:LC_ALL=''C.UTF-8'''
```


---



## 버그 설명

PowerShell에서 git log를 출력해보니 다음과 같이 한글이 깨져서 출력되는 일을 겪었습니다.
이 글에서는 이런 문제를 해결하는 방법을 다룹니다.

{{< image src="featured.png" width=100% >}}



---



## 왜 발생하는가?

Git과 PowerShell에서의 인코딩 형식이 호환되지 않아서 그렇습니다.



---



## 해결방법 1. Git 설정을 변경

첫 번째 방법은 git의 출력형식을 변경해주는 것입니다.
이 방법은 git의 설정만 변경할 뿐, PowerShell은 전혀 건드리지 않는다는 장점이 있습니다.

PowerShell에서 다음 명령어를 통해 git의 출력 설정을 변경합니다.
```powershell
git config --global core.pager 'less --raw-control-chars'
```

{{< image src="solved_git.png"  width=100% >}}

참고로 이 세팅을 해제하는 방법은 다음과 같습니다.
```powershell
git config --global --unset core.pager
```



---



## 해결방법 2. PowerShell 설정을 변경

두 번째 방법은 PowerShell에서 인코딩하는 방식을 변경해주는 것입니다.
이 방법은 PowerShell 설정을 변경하는 것이므로, PowerShell에서 사용하는 다른 프로그램에 영향을 줄 수도 있습니다.

### 해당 PowerShell 윈도우에서만 일시적으로 수정

Powershell에서 `$env:LC_ALL`이라는 환경변수의 값을 `'C.UTF-8'`로 설정해주면 됩니다.

{{< admonition warning >}}

이 방법은 그 PowerShell창에서만 유효합니다. 새로운 창에서는 문제가 다시 나타날 것입니다.

{{< /admonition >}}

다음 명령어를 입력하여 환경변수를 설정합니다.

```powershell
$env:LC_ALL='C.UTF-8'
```

{{< image src="solved_ps.png"  width=100% >}}

### PowerShell을 시작할 때마다 수정되도록 자동실행 스크립트 생성

PowerShell을 켤 때마다 자동으로 실행되는 스크립트를 만들고 그 스크립트에 `$env:LC_ALL` 환경변수를 설정하는 내용을 적으면, 매 번 환경변수를 따로 설정하지 않아도 자동으로 문제가 해결됩니다.

단, PowerShell에서 외부 스크립트를 실행하기 위해서는 **실행 정책**의 **제한을 풀어줘야** 합니다. 먼저, 다음 명령어를 통해 실행 정책 제한을 풀어줍니다.

```powershell
Set-ExecutionPolicy unrestricted
```

PowerShell을 켤 때마다 자동으로 실행되는 스크립트의 경로는 `$profile` 변수에 저장되어 있습니다. 다음 명령줄을 통해, 만약 해당 경로에 스크립트가 없다면 새로 만들어줍니다. 그 뒤, 만들어진 스크립트 파일에 `$env:LC_ALL='C.UTF-8'` 내용을 추가합니다. 이를 통해, 앞으로는 PowerShell을 새로 시작할 때마다 이 스크립트가 실행되어 환경변수가 설정되도록 할 수 있습니다.
```powershell {linenos=table}
if(!(Test-Path -path $profile)){ New-Item -Type File -Path $profile -Force }
Add-Content -Path $profile -Value '$env:LC_ALL=''C.UTF-8'''
```

---

## Reference

https://stackoverflow.com/questions/41139067/git-log-output-encoding-issues-on-windows-10-command-prompt
