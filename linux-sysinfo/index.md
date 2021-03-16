# 리눅스 운영체제에서 하드웨어/시스템 정보 모니터링 명령어 모음




리눅스 운영체제에서 하드웨어 및 시스템의 정보나 현재 상태를 살펴보는 데에 사용되는 명령어를 정리하였습니다.



<!--more-->

---



## OS 확인

```bash
lsb_release -a
```

{{< image src="lsb_release.png" width=40% >}}

## 메모리 및 swap 영역 상태 확인

```bash
free -h
```

{{< image src="free.png" width=100% >}}

## 디스크 용량 확인

```bash
df -h
```

{{< image src="df.png" width=70% >}}

## 파티션 정보 확인

```bash
lsblk
```

{{< image src="lsblk.png" width=50% >}}

## CPU 모델명 확인

```bash
cat /proc/cpuinfo | grep CPU | head -1
```

{{< image src="cpuinfo.png" width=70% >}}

## CPU 코어 수 확인

```bash
cat /proc/cpuinfo | grep CPU | wc -l
```

{{< image src="cpucore.png" width=70% >}}

## 서버 상태 확인

```bash
w
```

{{< image src="w.png" width=80% >}}
