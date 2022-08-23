# 기능을 구현해보며 이해하는 React

- vanilla ts로 spa를 만들어보는 프로젝트
- react의 기능을 구현해보며 라이브러리에 대한 이해도 향상
- virtual dom diffing알고리즘 적용으로 virtual dom에 대한 이해도 향상

## Todo list
1. costom-react로 dev matching 문제 풀기

### Hooks
- javascript의 클로저 메커니즘을 이용한다.
- 대표적으로 컴포넌트 별 상태관리를 담당하는 useState hook과 컴포넌트의 mount, unmount, update 기능을 제공하는 useEffect hook이 있다.

 ### Virtual DOM
- 브라우저 Rendering과정은 4가지가 있다.
```
1. Parsing
 - 토큰화 된 코드를 구조화 하는 과정
 - HTML파일은 DOM트리, CSS파일은 CSSOM트리로 구축됨
2. Render Tree
 - DOM 및 CSSOM을 결합하여 Render Tree를 구축함
 - 화면에 나타나는 요소를 결정하는 트리
 - 요소의 style이 계산된다
3. Layout/Reflow
 - 각 노드의 좌표가 주어지며, 화면에 그려야할 위치를 계산함
 - Root Object부터 재귀적으로 실행된다.
 - 노드의 크기와 위치가 처음 결정되는 시기를 Layout이라고 하며, 이를 후속 재계산한다면 Reflow라고 한다.
4. Painting
 - Rendering된 요소에 color를 입힌다.
 - Root Object부터 재귀적으로 실행되며, 트리의 각 Node를 거치며 paint() 메서드를 호출한다.
```
- DOM에 변화가 생길경우 위의 Rendering과정이 반복된다.
- 이에따라 DOM조작이 많이 발생하는데, 그때마다 위의 Rendering과정을 거치게 될 것이고, 이는 비효율 적인 작업이다.
- Virtual DOM을 이용한다면 그 내용을 Real DOM에 적용하기 전 Virtual DOM에 먼저 적용시킨 후 최종 결과를 RealDOM에 전달하므로 브라우저상에서 발생하는 연산의 양을 줄이는데 도움이 된다.

### Redux
1. 전역 상태 관리 시스템
2. closure, curring 기법을 활용하여 redux시스템을 구축한다.