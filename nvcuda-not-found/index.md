# nvcuda.dll not found 에러 해결


TensorFlow 설치 후 이용 시, nvcuda.dll을 찾지 못하는 오류를 해결하는 방법에 대해 알아봅니다.
<!--more-->

## TL;DR

<b>https://developer.nvidia.com/cudnn에서 CUDA 버전에 맞는 것을 다운받고, 압축을 풀어서 CUDA가 설치된 폴더에 넣습니다.</b>

{{< image src="copypaste.png" >}}

단, NVIDIA 회원가입, Developer 정보 입력, cuDNN 이용목적 등의 설문조사 참여가 필요합니다.



---



## 버그 설명

TensorFlow 2를 설치한 뒤 이용하려 할 때, nvcuda.dll을 찾지 못하는 에러가 발생하는 경우가 있습니다.

{{< image src="error.png" >}}



---



## 왜 발생하는가?

TensorFlow 2로 오면서, GPU 사용이 기본이 되었습니다. 이에 따라, 관련 하드웨어 및 소프트웨어 요구사항이 존재합니다.

자세한 사항은 [tensorflow 설치가이드](https://www.tensorflow.org/install/gpu)에서 확인할 수 있습니다.

{{< image src="hw_req.png" >}}

{{< image src="sw_req.png" >}}



---



## 해결방법

NVIDIA 홈페이지의 cuDNN 다운로드 페이지에서 맞는 버전을 다운받아 설치합니다.

단, cuDNN은 NVIDIA에의 회원가입 및 개발자가입이 요구됩니다. 그리고 cuDNN을 어떤 목적으로 사용할 것인지에 대한 설문조사도 있습니다.

2020년 10월 기준 TensorFlow 2에서 요구하는 버전은 cuDNN SDK 7.6이고, CUDA 10.1 버전을 지원하므로, 이에 맞추어 받으시면 됩니다.

{{< image src="version_select.png" >}}

해당 링크에서 압축파일이 받아지는데, 이를 풀면 `cuda` 폴더가 나옵니다.

이 안의 내용물을, CUDA를 설치한 폴더 안에 그대로 붙여넣으시면 됩니다. (일반적으로는 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\vXX.X`)

{{< image src="copypaste.png" >}}
