import type { ReactDOM, ProviderType } from '../types';

/**
 * virtual dom을 real dom으로 적용 (재귀적으로 동작)
 * @param node - 부모노드
 * @param dom - virtual dom
 */
const makeNode = (node: HTMLElement, dom?: ReactDOM) => {
  if (!dom) {
    return;
  }
  if (!dom.tagName && !dom.node) {
    return;
  }
  const { tagName, event, props, childNode, frontStringNode, backStringNode } =
    dom;
  const element: HTMLElement = dom.node || document.createElement(tagName);

  // Setting node property
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      (element as any)[key] = value;
    }
  }

  // Setting node event
  if (event) {
    if (Array.isArray(event)) {
      event.forEach((e: { type: string; eventFunc: () => void }) => {
        const { type, eventFunc } = e;
        element.addEventListener(type, eventFunc);
      });
    } else {
      const { type, eventFunc } = event;
      element.addEventListener(type, eventFunc);
    }
  }

  // Setting string on front of node
  if (frontStringNode !== undefined) {
    node.insertAdjacentText('beforeend', frontStringNode);
  }

  if (element) {
    node.insertAdjacentElement('beforeend', element);
  }

  // Setting string on back of node
  if (backStringNode !== undefined) {
    node.insertAdjacentText('beforeend', backStringNode);
  }

  if (childNode !== undefined) {
    createDOM(element, childNode);
  }
};

/**
 * virtual dom을 real dom에 적용 (재귀적으로 동작)
 * @param node - 부모노드
 * @param dom - virtual dom
 */
export const createDOM = (
  node: HTMLElement,
  dom?: ReactDOM[] | ReactDOM | string | null,
) => {
  if (dom === undefined || dom === null) return;
  if (typeof dom === 'string') {
    node.innerHTML = dom;
    return;
  }

  if (Array.isArray(dom)) {
    dom.forEach((d: ReactDOM | string) => {
      if (typeof d === 'string') {
        console.error('문자열 노드는 배열로 할당할 수 없습니다.');
      } else {
        makeNode(node, d);
      }
    });
    return;
  }

  makeNode(node, dom);
};

/**
 * 연속 rerendering 방지
 * @param callback - 실행 callback함수
 * @returns 다음 호출
 */
export const debounceFrame = (callback: FrameRequestCallback) => {
  let nextFrameCallack = 0;

  const nextExecution = () => {
    cancelAnimationFrame(nextFrameCallack);
    nextFrameCallack = requestAnimationFrame(callback);
  };

  return nextExecution;
};

/**
 * store 존재 유무 파악
 * @param arg - react 컴포넌트 객체
 * @returns - store 포함 유무 반환
 */
export function isProvider(arg: any): arg is ProviderType {
  return arg.length === undefined && arg.tagName === undefined;
}
