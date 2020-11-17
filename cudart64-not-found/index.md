# cudart64_xxx.dll not found 에러 해결


TensorFlow 설치 후 이용 시, cudart64_xxx.dll을 찾지 못하는 오류를 해결하는 방법에 대해 알아봅니다.

<!--more-->

## TL;DR

<b>https://developer.nvidia.com/cuda-toolkit-archive에서 맞는 버전을 다운받아 설치합니다.</b>

- 예: cudart64_101.dll -> CUDA Toolkit 10.1 update 2 설치



---



## 버그 설명

TensorFlow 2를 설치한 뒤 이용하려 할 때, cudart64_xxx.dll을 찾지 못하는 에러가 발생하는 경우가 있습니다.

{{< image src="error.png" >}}



---



## 왜 발생하는가?

TensorFlow 2로 오면서, GPU 사용이 기본이 되었습니다. 이에 따라, 관련 하드웨어 및 소프트웨어 요구사항이 존재합니다.

자세한 사항은 [tensorflow 설치가이드](https://www.tensorflow.org/install/gpu)에서 확인할 수 있습니다.

{{< image src="hw_req.png" >}}

{{< image src="sw_req.png" >}}



---



## 해결방법

NVIDIA 홈페이지의 CUDA Toolkit 다운로드 페이지에서 맞는 버전을 다운받아 설치합니다.

최신 버전을 요구하지 않는 경우가 있으므로, [이 곳](https://developer.nvidia.com/cuda-toolkit-archive)에서 해당하는 버전을 찾아 설치하시면 됩니다.

`cudart64_xxx.dll`에서 xxx 부분이 버전에 해당합니다. 

예를 들어, 2020년 10월 기준 TensorFlow 2에서 요구하는 버전은 `cudart64_101.dll`로, 10.1 버전을 받으시면 됩니다.

아래 그림과 같이 뜨면 성공입니다.

{{< image src="solved.png" >}}
