import { createGlobalStyle } from "styled-components";

export const ReplyViewStyle = createGlobalStyle`
    .ReplyView {
        padding: 17px 0 16px 50px;
        margin-left: 0;
        position: relative;
        width: 100%;

        &__toggle {
            display: flex;
            justify-content: center;
            padding: 12px 20px;
            align-items: center;
        }
        &__replies{
            position: relative;
            padding: 0 0 0 12px;

        }
        &__script{
           margin: 18px 0 0 !important;
           padding: 0;
        }
        &__collapse{
            margin-top:14px;
        }
        &__link{
            cursor: pointer;
            color: var(--default);
            font-size: var(--link-font-size);
            line-height: 1;
            
            &_previous{
                display: table; 
                margin: 0 auto;
                text-decoration: underline;
                line-height: 1;
                margin-top: -10px;
                margin-bottom: 18px;
            }
            &_next{
                display: table; 
                margin: 0 auto;
                text-decoration: underline;
                line-height: 1;
                margin-top: 18px;
            }
            &_collapse{
                display: table; 
                margin: 0 auto;
            }
            &_disabled{
                pointer-events: none;
                color:grey !important;
            }
        }
        &__divider{
            margin: 0 0 0 20px;
            height: 1px;
            width: calc(100% - 40px);
            background-color: var(--divider-color);
            &_transparent{
                background-color:transparent;
                margin:0;
            }
        }
        &__separator{
            position: absolute;
            left: 0;
            height: 100%;
            width: 1px;
            background: #CCCCCC;
            // border-radius: 10px;
            // z-index: 1;
        }

        .ql-editor {
            word-break: break-word;
            padding-right: 30px;
        }

        .post,
        .post__desc{
            padding-right: 0;
        }
        //.post__desc:hover{
        //    background-color : #c4c4c4;
        //}
        .left-border,
        .left-border-tagged {
            padding-bottom: 0;
            padding-right: 0;
        }
        .post{
            margin-bottom: 0;
        }

        // & .post:hover  .post__header .post__toolbox {
        //     visibility: visible;
        // }

        &__replies{
            .ReplyView__placeholder{
                left: 33px;
            }

        }
        .script-textarea{
            min-height: 46px;
            width: calc(100% - 15px);
            border: 1px solid #ADBACD;
            outline: none;
            padding: 13px 15px;
            font-size: 15px;
            color: #65656c !important;
            background-color: white;
            resize: none;
            margin-bottom: 8px;
            border-radius:2px;
            &:focus{
                border: 1px solid #c1c1c1;
            }
        }
        .script-textarea:empty~p{
            display:block;
        }
        .script-textarea:focus {
            border: 1px solid var(--light-gray2);
        }
        &__placeholder{
            display: none;
            position: absolute;
            margin-top: -43px;
            left: 16px;
            font-weight: 300;
            font-size: var(--default-font-size);
            color:var(--light-gray2);
            opacity: 0.9;
        }

        &__mentions{
            z-index: 1;
            list-style: none;
            padding: 4px 0;
            background: #FFFFFF;
            box-shadow: 0px 0px 4px rgba(76, 99, 128, 0.3);
            border-radius: 2px;
            text-align: left;
            max-height: 250px;
            overflow-y:auto;
            white-space: nowrap;
            li{
                display: flex;
                align-items: center;
                padding: 4px 10px;
                margin-bottom: 0 !important;
                :hover, &.focused{
                    background-color: #f1f6fc;
                }
                :before {
                    margin: 0 !important;
                    content: "" !important;
                }
            }
        }
        &__tooltip{
            padding: 0;
            display: none;
            position: absolute;
            bottom: 15px;
            left: -10px;
            z-index: 100;
        }
        &__tooltip:hover{
            display: block !important;
        }
        
   }
`;
