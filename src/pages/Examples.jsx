
import React from 'react';
import { BasicInterpolationExample } from '../examples/InterpolationExamples';
import TranslationExample from '../examples/TranslationExample';

        

const Examples = () => {
    return (
        <div>
            <h1>Examples Page</h1>
            <p>This page showcases various examples.</p>
            {/* Add your example components here */}

            {/* 插值示例 */}
            <h2>插值示例</h2>
            <BasicInterpolationExample />

            <h2>插值示例</h2>
            <TranslationExample />
        </div>
    );
}

export default Examples;