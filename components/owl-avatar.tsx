export function OwlAvatar({ name }: { name: string }) {
  return (
    <svg
      className="avatar person-owl"
      viewBox="0 0 320 320"
      role="img"
      aria-label={`${name}, owl in a suit and tie`}
    >
      <path d="M70 218H250Q304 230 306 290V320H14V290Q16 230 70 218Z" fill="#0B1B3A" />
      <path d="M126 218H194L160 274Z" fill="#fff" />
      <path d="M114 218H126L160 274L140 302L98 262Z" fill="#17305E" />
      <path d="M206 218H194L160 274L180 302L222 262Z" fill="#17305E" />
      <path d="M150 266H170L166 282H154Z" fill="#2864F0" />
      <path d="M154 282H166L177 318L160 330L143 318Z" fill="#2864F0" />
      <g transform="translate(37.5 -2) scale(.7)">
        <g
          transform="translate(20,20)"
          fill="none"
          stroke="#0828CB"
          strokeWidth="22"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        >
          <path d="M17 288V150A138 138 0 0 1 293 150V288Z" strokeWidth="24" />
          <path d="M29 98A137 137 0 1 0 281 98" />
          <path d="M22 112C28 76 110 60 155 134" />
          <path d="M288 112C282 76 200 60 155 134" />
          <path d="M155 112V290" />
          <circle cx="86" cy="157" r="20" fill="#0828CB" stroke="none" />
          <circle cx="224" cy="157" r="20" fill="#0828CB" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
