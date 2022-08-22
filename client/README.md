# 바닐라 js 개발환경 보일러 플레이트
- js, ts개발 환경 셋팅

# spa를 만들기위한 조건
- 상태관리 시스템
	+ 클로저로 상태 관리
	+ 상태 변경 시 렌더링
	+ 렌더링 시 debounceFrame 적용
```ts
type VDOM = {
	node: string;
	childNode: VDOM;
}
```
- 라우팅 시스템
	+ Object로 컴포넌트, path 표현
	+ queryString 플래그로 사용여부 확인
```ts
{
	path: string;
	component: () => ReactDOM;
	queryString: boolean;
}
```
