
export const Ellipsis = (props) => {
    const {children, limit} = props;
    return children && children?.length > limit ? children.substring(0, limit || children?.length) + '...' : children;
}
