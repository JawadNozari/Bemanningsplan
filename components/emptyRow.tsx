function EmptyRow(props: any) {
  return (
    <>
      {[...Array(props.quantity)].map((_, i) => {
        return (
          <tr key={i} className="border border-slate-700">
            <>
              {[...Array(8)].map((_, i) => {
                return (
                  <td key={i} className="border py-[0.5em] border-slate-700">
                    <div className="focus:outline-none" contentEditable={true} suppressContentEditableWarning={true}></div>
                  </td>
                );
              })}
            </>
          </tr>
        );
      })}
    </>
  );
}
export default EmptyRow;
