
import React from 'react';
import { BasicInterpolationExample } from '../examples/InterpolationExamples';
import TranslationExample from '../examples/TranslationExample';
// import ApiExamples from '../examples/ApiExamples';

        

const Examples = () => {
    return (
        <div>
            <h1>Examples Page</h1>
            <p>This page showcases various examples.</p>
            {/* Add your example components here */}

            {/* API示例 */}
            {/*<ApiExamples />*/}

            {/* 插值示例 */}
            <h2>插值示例</h2>
            <BasicInterpolationExample />

            <h2>翻译示例</h2>
            <TranslationExample />
        </div>
    );
}

export default Examples;