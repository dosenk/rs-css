const newData = {
  1: {
    elem: ['<mat id="q1">', '</mat>'],
    nextElem: {
      elem: ['<book id="q2">', '</book>'],
      nextElem: {
        elem: ['<book class="moved" id="q8">', '</book>'],
        nextElem: {
          elem: ['<book class="small" id="q9"/>'],
        },
      },
    },
  },
  2: `<book id="q3">
    <book id="q4">
    <book class="small moved" id="q8"/>
    </book>
    </book>`,
};

export default newData;
